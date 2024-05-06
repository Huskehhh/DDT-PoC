import { Button, LoadingOverlay, Stack, TextInput, Switch, Checkbox, NativeSelect } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useState } from "react";
import { CommandHelper } from "../../utils/CommandHelper";
import ConsoleWrapper from "../ConsoleWrapper/ConsoleWrapper";
import { UserGuide } from "../UserGuide/UserGuide";
import { SaveOutputToTextFile } from "../SaveOutputToFile/SaveOutputToTextFile";
const title = "The Harvester";
const description_userguide =
    "A tool for gathering subdomain names, e-mail addresses, virtual hosts, open ports/ banners, and employee names from different public sources (search engines, pgp key servers)." +
    "\n\nInformation on the tool can be found at: https://www.kali.org/tools/theharvester/\n\n" +
    "Step 1: Enter a valid domain to be harvested.\n" +
    "       Eg: kali.org\n\n" +
    "Step 2: Enter a limit for the requests. Default is 500 results. Can be left blank.\n" +
    "       Eg: 500\n\n" +
    "Step 3: Select a source to search form. The list contains compatible search engines.\n" +
    "       Eg: baidu\n\n" +
    "Step 4: Click Start Harvesting to commence tool's operation.\n\n" +
    "Step 5: View the Output block below to view the results of the tool's execution.\n\n" +
    "Switch to Advanced Mode for further options.";
interface FormValuesType {
    domain: string;
    resultlimit: number;
    source: string;
    startresult: number;
    useshodan: boolean;
    dnslookup: boolean;
    dnsbrute: boolean;
    virtualhost: boolean;
    takeover: boolean;
}
const sources = [
    { value: "anubis", label: "Anubis" },
    { value: "baidu", label: "Baidu" },
    { value: "brave", label: "Brave" },
    { value: "certspotter", label: "Certspotter" },
    { value: "crtsh", label: "Crtsh" },
    { value: "dnsdumpster", label: "DNSdumpster" },
    { value: "duckduckgo", label: "DuckDuckGo" },
    { value: "hackertarget", label: "Hackertarget" },
    { value: "otx", label: "OTX" },
    { value: "rapiddns", label: "RapidDNS" },
    { value: "sitedossier", label: "Sitedossier" },
    { value: "subdomaincenter", label: "Subdomaincenter" },
    { value: "subdomainfinderc99", label: "Subdomainfinderc99" },
    { value: "threatminer", label: "Threatminer" },
    { value: "urlscan", label: "URLScan" },
    { value: "virustotal", label: "Virustotal" },
    { value: "yahoo", label: "Yahoo" },
];

const TheHarvester = () => {
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState("");
    const [checkedAdvanced, setCheckedAdvanced] = useState(false);
    const [selectedSource, setSelectedSource] = useState("");
    const [pid, setPid] = useState("");
    let form = useForm({
        initialValues: {
            domain: "",
            resultlimit: 500,
            source: "",
            startresult: 0,
            useshodan: false,
            dnslookup: false,
            dnsbrute: false,
            virtualhost: false,
            takeover: false,
        },
    });
    // Uses the callback function of runCommandGetPidAndOutput to handle and save data
    // generated by the executing process into the output state variable.
    const handleProcessData = useCallback((data: string) => {
        setOutput((prevOutput) => prevOutput + "\n" + data); // Update output
    }, []);
    // Uses the onTermination callback function of runCommandGetPidAndOutput to handle
    // the termination of that process, resetting state variables, handling the output data,
    // and informing the user.
    const handleProcessTermination = useCallback(
        ({ code, signal }: { code: number; signal: number }) => {
            if (code === 0) {
                handleProcessData("\nProcess completed successfully.");
            } else if (signal === 15) {
                handleProcessData("\nProcess was manually terminated.");
            } else {
                handleProcessData(`\nProcess terminated with exit code: ${code} and signal code: ${signal}`);
            }
            // Clear the child process pid reference
            setPid("");
            // Cancel the Loading Overlay
            setLoading(false);
        },
        [handleProcessData]
    );
    // Sends a SIGTERM signal to gracefully terminate the process
    const handleCancel = () => {
        if (pid !== null) {
            const args = [`-15`, pid];
            CommandHelper.runCommand("kill", args);
        }
    };
    const onSubmit = async (values: FormValuesType) => {
        setLoading(true);
        const args = ["-d", `${values.domain}`, "-l", `${values.resultlimit}`, "-b", `${selectedSource}`];
        if (values.startresult) {
            args.push(`-S ${values.startresult}`);
        }
        if (values.useshodan === true) {
            args.push(`-s`);
        }
        if (values.dnslookup === true) {
            args.push(`-n`);
        }
        if (values.dnsbrute === true) {
            args.push(`-c`);
        }
        if (values.virtualhost === true) {
            args.push(`-v`);
        }
        if (values.takeover === true) {
            args.push(`-t`);
        }
        const filteredArgs = args.filter((arg) => arg !== "");
        try {
            const result = await CommandHelper.runCommandGetPidAndOutput(
                "theHarvester",
                filteredArgs,
                handleProcessData,
                handleProcessTermination
            );
            setOutput(result.output);
        } catch (e: any) {
            setOutput(e.message);
        }
        setLoading(false);
    };
    const clearOutput = useCallback(() => {
        setOutput("");
    }, [setOutput]);
    return (
        <form onSubmit={form.onSubmit(onSubmit)}>
            <LoadingOverlay visible={loading} />
            {loading && (
                <div>
                    <Button variant="outline" color="red" style={{ zIndex: 1001 }} onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            )}
            <Stack>
                {UserGuide(title, description_userguide)}
                <Switch
                    size="md"
                    label="Advanced Mode"
                    checked={checkedAdvanced}
                    onChange={(e) => setCheckedAdvanced(e.currentTarget.checked)}
                />
                <TextInput label={"Domain"} required {...form.getInputProps("domain")} />
                <TextInput
                    label={"Limit of results searched/shown (default 500)"}
                    type="number"
                    {...form.getInputProps("resultlimit")}
                />
                <NativeSelect
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    title={"Source"}
                    data={sources}
                    required
                    placeholder={"Select a source"}
                    description={"Source to search from"}
                />
                {checkedAdvanced && (
                    <>
                        <TextInput
                            label={"Start with result number X. (default 0)"}
                            type="number"
                            {...form.getInputProps("startresult")}
                        />
                        <Checkbox
                            label={"Use Shodan to query discovered hosts."}
                            type="checkbox"
                            {...form.getInputProps("useshodan")}
                        />
                        <Checkbox
                            label={"DNS Lookup (Enable DNS server lookup)"}
                            type="checkbox"
                            {...form.getInputProps("dnslookup")}
                        />
                        <Checkbox
                            label={"DNS Brute (Perform a DNS brute force on the domain.)"}
                            type="checkbox"
                            {...form.getInputProps("dnsbrute")}
                        />
                        <Checkbox
                            label={"Virtual Host (Verify host name via DNS resolution and search for virtual hosts.)"}
                            type="checkbox"
                            {...form.getInputProps("virtualhost")}
                        />
                        <Checkbox
                            label={"Takeover (Check for takeovers.)"}
                            type="checkbox"
                            {...form.getInputProps("takeover")}
                        />
                    </>
                )}
                <br></br>
                <Button type={"submit"}>Start Harvesting</Button>
                {SaveOutputToTextFile(output)}
                <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
            </Stack>
        </form>
    );
};

export default TheHarvester;

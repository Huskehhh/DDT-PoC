import { Button, NativeSelect, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useState } from "react";
import { CommandHelper } from "../../utils/CommandHelper";
import ConsoleWrapper from "../ConsoleWrapper/ConsoleWrapper";
import { SaveOutputToTextFile_v2 } from "../SaveOutputToFile/SaveOutputToTextFile";
import { UserGuide } from "../UserGuide/UserGuide";
import { LoadingOverlayAndCancelButton } from "../OverlayAndCancelButton/OverlayAndCancelButton";

// Title of the component
const title = "SMB Enumeration";

// Source link to the official documentation for SMB enumeration scripts
const sourceLink = "https://nmap.org/nsedoc/scripts/";

// Description for the user guide, explaining how to use the tool
const descriptionUserGuide = `
    SMB (Server Message Block) is a widely used network protocol that provides shared access to files, printers, and serial ports within a network.
    This tool aims to enumerate an SMB server to identify potential vulnerabilities.

    How to use SMB Enumeration:
    Step 1: Enter an IP address or hostname. E.g., 127.0.0.1
    Step 2: Enter a port number. E.g., 445
    Step 3: Select a scan speed. Note that higher speeds require a faster host network.
    T0 - Paranoid / T1 - Sneaky / T2 - Polite / T3 - Normal / T4 - Aggressive / T5 - Insane. E.g., T3
    Step 4: Select an SMB enumeration script to run against the target. E.g., smb-flood.nse
    Step 5: Click scan to commence the SMB enumeration operation.
    Step 6: Check the output block below to see the results of the scan.

    For more details, visit the [official documentation](${sourceLink}).
`;

// Interface representing the form values for the SMBEnumeration component
interface FormValuesType {
    ip: string; // The IP address or hostname
    port: string; // The port number
    speed: string; // The scan speed
    script: string; // The selected SMB enumeration script
}

// The scan speeds available for selection
const speeds = ["T0", "T1", "T2", "T3", "T4", "T5"];

// The list of available SMB enumeration scripts
const scripts = [
    "smb2-capabilities.nse",
    "smb2-security-mode.nse",
    "smb2-time.nse",
    "smb2-vuln-uptime.nse",
    "smb-brute.nse",
    "smb-double-pulsar-backdoor.nse",
    "smb-enum-domains.nse",
    "smb-enum-groups.nse",
    "smb-enum-processes.nse",
    "smb-enum-services.nse",
    "smb-enum-sessions.nse",
    "smb-enum-shares.nse",
    "smb-enum-users.nse",
    "smb-flood.nse",
    "smb-ls.nse",
    "smb-mbenum.nse",
    "smb-os-discovery.nse",
    "smb-print-text.nse",
    "smb-protocols.nse",
    "smb-psexec.nse",
    "smb-security-mode.nse",
    "smb-server-stats.nse",
    "smb-system-info.nse",
    "smb-vuln-conficker.nse",
    "smb-vuln-cve2009-3103.nse",
    "smb-vuln-cve-2017-7494.nse",
    "smb-vuln-ms06-025.nse",
    "smb-vuln-ms07-029.nse",
    "smb-vuln-ms08-067.nse",
    "smb-vuln-ms10-054.nse",
    "smb-vuln-ms10-061.nse",
    "smb-vuln-ms17-010.nse",
    "smb-vuln-regsvc-dos.nse",
    "smb-vuln-webexec.nse",
    "smb-webexec-exploit.nse",
];

// The main component for SMB Enumeration
const SMBEnumeration = () => {
    // Component state variables with specific types
    const [loading, setLoading] = useState<boolean>(false);
    const [output, setOutput] = useState<string>("");
    const [allowSave, setAllowSave] = useState<boolean>(false);
    const [hasSaved, setHasSaved] = useState<boolean>(false);
    const [selectedSpeedOption, setSelectedSpeedOption] = useState<string>(speeds[3]);
    const [selectedScriptOption, setSelectedScriptOption] = useState<string>(scripts[12]);
    const [pid, setPid] = useState<string>("");

    // useForm hook to manage form state and validation
    const form = useForm<FormValuesType>({
        initialValues: {
            ip: "",
            port: "",
            speed: selectedSpeedOption,
            script: selectedScriptOption,
        },
    });

    // Handles incoming data from the running process, updating the output state
    const handleProcessData = useCallback(
        (data: string) => {
            setOutput((prevOutput) => prevOutput + "\n" + data);
            if (!allowSave) setAllowSave(true);
        },
        [allowSave]
    );

    // Handles the termination of the running process, updating the state and informing the user
    const handleProcessTermination = useCallback(
        ({ code, signal }: { code: number; signal: number }) => {
            if (code === 0) {
                handleProcessData("\nProcess completed successfully.");
            } else if (signal === 15) {
                handleProcessData("\nProcess was manually terminated.");
            } else {
                handleProcessData(`\nProcess terminated with exit code: ${code} and signal code: ${signal}`);
            }
            setPid("");
            setLoading(false);
            setAllowSave(true);
        },
        [handleProcessData]
    );

    // onSubmit function is called when the form is submitted
    const onSubmit = async (values: FormValuesType) => {
        setLoading(true);
        setAllowSave(false);
        setHasSaved(false);

        const args = [`-${values.speed}`, `--script=${values.script}`];

        if (values.port) {
            args.push(`-p ${values.port}`);
        }

        args.push(values.ip);

        try {
            const result = await CommandHelper.runCommandGetPidAndOutput(
                "nmap",
                args,
                handleProcessData,
                handleProcessTermination
            );
            setPid(result.pid);
            setOutput(result.output);
        } catch (e: any) {
            setOutput(e.message || "An error occurred during the scan.");
        }
    };

    // Clears the output state
    const clearOutput = useCallback(() => {
        setOutput("");
        setAllowSave(false);
        setHasSaved(false);
    }, []);

    // Updates the component's state after the user has successfully saved the scan results
    const handleSaveComplete = useCallback(() => {
        setHasSaved(true);
        setAllowSave(false);
    }, []);

    // Rendering the form and related components
    return (
        <form
            onSubmit={form.onSubmit((values) =>
                onSubmit({
                    ...values,
                    speed: selectedSpeedOption,
                    script: selectedScriptOption,
                })
            )}
        >
            {LoadingOverlayAndCancelButton(loading, pid)}
            <Stack>
                {UserGuide(title, descriptionUserGuide)}
                <TextInput label={"Target IP or Hostname"} required {...form.getInputProps("ip")} />
                <TextInput label={"Port"} required {...form.getInputProps("port")} placeholder={"Example: 445"} />
                <NativeSelect
                    label={"Scan Speed"}
                    value={selectedSpeedOption}
                    onChange={(e) => setSelectedSpeedOption(e.target.value)}
                    title={"Scan speed"}
                    data={speeds}
                    description={"Speed of the scan, refer: https://nmap.org/book/performance-timing-templates.html"}
                />
                <NativeSelect
                    label={"SMB Script"}
                    value={selectedScriptOption}
                    onChange={(e) => setSelectedScriptOption(e.target.value)}
                    title={"SMB Enumeration Script"}
                    data={scripts}
                    required
                    description={"NSE Scripts, refer: https://nmap.org/nsedoc/scripts/"}
                />
                <Button type={"submit"}>Scan</Button>
                {SaveOutputToTextFile_v2(output, allowSave, hasSaved, handleSaveComplete)}
                <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
            </Stack>
        </form>
    );
};

export default SMBEnumeration;

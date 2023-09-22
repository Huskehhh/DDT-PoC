import { Button, Checkbox, LoadingOverlay, Stack, TextInput, Switch } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useState } from "react";
import { CommandHelper } from "../../utils/CommandHelper";
import ConsoleWrapper from "../ConsoleWrapper/ConsoleWrapper";
import { UserGuide } from "../UserGuide/UserGuide";
import { SaveOutputToTextFile_v2 } from "../SaveOutputToFile/SaveOutputToTextFile";
import { LoadingOverlayAndCancelButton } from "../OverlayAndCancelButton/OverlayAndCancelButton";

const title = "Dirb";
const description_userguide =
    "Dirb is a Web Content Scanner that acts to seek out any existing or hidden Web Objects. " +
    "This is a dictionary-based attack that takes place upon a web server and will analyse the " +
    "results within this process.\n\nHow to use Dirb:\n\nStep 1: Enter a valid URL.\n" +
    "       E.g. https://www.deakin.edu.au\n\nStep 2: Enter a file directory pathway to access " +
    "a wordlist\n       E.g. home/wordlist/wordlist.txt\n\nStep 3: Click Scan to commence " +
    "the Dirb operation.\n\nStep 4: View the Output block below to view the results of the tool's execution.";

interface FormValues {
    url: string;
    wordlistPath: string;
    caseInsensitive: boolean;
    printLocation: boolean;
    ignoreHttpCode: number;
}

export function DirbTool() {
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState("");
    const [checkedAdvanced, setCheckedAdvanced] = useState(false);
    const [pid, setPid] = useState("");
    const [allowSave, setAllowSave] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);

    let form = useForm({
        initialValues: {
            url: "",
            wordlistPath: "",
            caseInsensitive: false,
            printLocation: false,
            ignoreHttpCode: 0,
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

            // Allow Saving as the output is finalised
            setAllowSave(true);
            setHasSaved(false);
        },
        [handleProcessData]
    );

    // Actions taken after saving the output
    const handleSaveComplete = () => {
        // Indicating that the file has saved which is passed
        // back into SaveOutputToTextFile to inform the user
        setHasSaved(true);
        setAllowSave(false);
    };

    const onSubmit = async (values: FormValues) => {
        // Disallow saving until the tool's execution is complete
        setAllowSave(false);

        setLoading(true);

        const args = [values.url, values.wordlistPath];

        if (values.caseInsensitive) {
            args.push(`-S ${values.caseInsensitive}`);
        }

        if (values.printLocation) {
            args.push(`-s ${values.printLocation}`);
        }

        if (values.ignoreHttpCode) {
            args.push(`-t ${values.ignoreHttpCode}`);
        }

        CommandHelper.runCommandGetPidAndOutput("dirb", args, handleProcessData, handleProcessTermination)
            .then(({ pid, output }) => {
                setPid(pid);
                setOutput(output);
            })
            .catch((error) => {
                setLoading(false);
                setOutput(`Error: ${error.message}`);
            });
    };

    const clearOutput = useCallback(() => {
        setOutput("");
        setHasSaved(false);
        setAllowSave(false);
    }, [setOutput]);

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            {LoadingOverlayAndCancelButton(loading, pid)}
            <Stack>
                {UserGuide(title, description_userguide)}
                <Switch
                    size="md"
                    label="Advanced Mode"
                    checked={checkedAdvanced}
                    onChange={(e) => setCheckedAdvanced(e.currentTarget.checked)}
                />
                <TextInput label={"URL"} required {...form.getInputProps("url")} />
                <TextInput label={"Path to wordlist"} required {...form.getInputProps("wordlistPath")} />
                {checkedAdvanced && (
                    <>
                        <Checkbox label={"Use case-insensitive search"} {...form.getInputProps("caseInsensitive")} />
                        <Checkbox
                            label={"Print 'Location' header when found"}
                            {...form.getInputProps("printLocation")}
                        />
                        <TextInput
                            label={"Ignore responses with this HTTP code"}
                            type="number"
                            {...form.getInputProps("ignoreHttpCode")}
                        />
                    </>
                )}
                <Button type={"submit"}>Scan</Button>
                {SaveOutputToTextFile_v2(output, allowSave, hasSaved, handleSaveComplete)}
                <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
            </Stack>
        </form>
    );
}

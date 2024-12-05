import { Button, Stack, TextInput, Group, Switch } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useState, useEffect } from "react";
import { CommandHelper } from "../../utils/CommandHelper";
import ConsoleWrapper from "../ConsoleWrapper/ConsoleWrapper";
import { RenderComponent } from "../UserGuide/UserGuide";
import { SaveOutputToTextFile_v2 } from "../SaveOutputToFile/SaveOutputToTextFile";
import { LoadingOverlayAndCancelButton } from "../OverlayAndCancelButton/OverlayAndCancelButton";
import { checkAllCommandsAvailability } from "../../utils/CommandAvailability";
import InstallationModal from "../InstallationModal/InstallationModal";

/**
 * Represents the form values for the Ffuf component.
 */
interface FormValuesType {
    wordList: string;
    url: string;
    output: string;
    filterSize: string;
    extensions: string;
    filterWords: string;
    filterLines: string;
}

/**
 * The Ffuftool component.
 * @returns The Ffuftool component.
 */
const FfufTool = () => {
    // Component State Variables
    const [loading, setLoading] = useState(false); // State variable to indicate loading state.
    const [output, setOutput] = useState(""); // State variable to store the output of the command execution.
    const [checkedStopWhen, setCheckedStopWhen] = useState(false);
    const [checkedVerboseOutput, setCheckedVerboseOutput] = useState(false);
    const [checkedAdvanced, setCheckedAdvanced] = useState(false);
    const [pid, setPid] = useState(""); // State variable to store the process ID of the command execution.
    const [allowSave, setAllowSave] = useState(false); // State variable to allow saving the output to a file
    const [hasSaved, setHasSaved] = useState(false); // State variable to indicate if the output has been saved.
    const [isCommandAvailable, setIsCommandAvailable] = useState(false); // State variable to check if the command is available.
    const [opened, setOpened] = useState(!isCommandAvailable); // State variable that indicates if the modal is opened.
    const [loadingModal, setLoadingModal] = useState(true); // State variable to indicate loading state of the modal.

    // Component constants.
    const title = "ffuf"; // Contains the title of the component.

    // Contains the description of the component.
    const description =
        "ffuf is a web directory and resource discovery tool. It takes a wordlist " +
        "and uses a brute force fuzzing technique against a target URL to attempt to discover valid files " +
        "and directories. This can reveal vulnerabilities in web applications as well generally data-mine " +
        "and map out the target. ffuf can even be used to brute force credentials used in web authentication.\n\n" +
        "For further information on ffuf: https://github.com/ffuf/ffufS\n\n" +
        "Wordlist directory: /usr/share/ddt/ffuf_wordlists/\n\n" +
        "Basic ffuf brute force discovery:\n\n";
    const steps = ["Step 1: Enter a URL to be fuzzed\n" +
        "       E.g. http://www.example.com/FUZZ\n\n" +
        "Step 2: Optionally enter a wordlist other than the default\n" +
        "       E.g. wordlist.txt\n\n" +
        "Step 3: Optionally enter extensions to be added to words. Comma separated." +
        "\n         E.g. .html,.php,.txt" +
        "\n\nStep 4: Click Scan to commence the ffuf operation.\n" +
        "Step 5: View the Output block below to view the results of the Scan."];
    const sourceLink = "https://www.kali.org/tools/ffuf/"; // Link to the source code (or Kali Tools).
    const tutorial = "https://docs.google.com/document/d/1ntOm0yiqLnhTfqqcmbJC3bpjzJ5Ymqe3Oi67qULHWTE/edit?usp=sharing"; // Link to the official documentation/tutorial.
    const dependencies = ["ffuf"]; // Contains the dependencies required by the component.

    // Form Hook to handle form input.
    let form = useForm({
        initialValues: {
            wordList: "",
            url: "",
            output: "",
            filterSize: "",
            extensions: "",
            filterWords: "",
            filterLines: "",
        },
    });

    // Check if the command is available and set the state variables accordingly.
    useEffect(() => {
        // Check if the command is available and set the state variables accordingly.
        checkAllCommandsAvailability(dependencies)
            .then((isAvailable) => {
                setIsCommandAvailable(isAvailable); // Set the command availability state
                setOpened(!isAvailable); // Set the modal state to opened if the command is not available
                setLoadingModal(false); // Set loading to false after the check is done
            })
            .catch((error) => {
                console.error("An error occurred:", error);
                setLoadingModal(false); // Also set loading to false in case of error
            });
    }, []);

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

    /**
     * onSubmit: Asynchronous handler for the form submission event.
     * It sets up and triggers the ffuf tool with the given parameters.
     * Once the command is executed, the results or errors are displayed in the output.
     *
     * @param {FormValuesType} values - The form values, containing the wordlist, url, output, filterSize, extensions, filterWords and filterLines interface.
     */
    const onSubmit = async (values: FormValuesType) => {
        // Disallow saving until the tool's execution is complete
        setAllowSave(false);

        // Start the Loading Overlay
        setLoading(true);

        const args = [`-u`, `${values.url}/FUZZ`];

        if (values.wordList) {
            args.push(`-w`, `/usr/share/ddt/ffuf_wordlists/${values.wordList}`);
        } else args.push(`-w`, `/usr/share/ddt/ffuf_wordlists/default_SECLIST_wordlist.txt`);

        if (values.extensions) {
            args.push(`-e`, `${values.extensions}`);
        }

        if (values.output) {
            args.push(`-o`, `${values.output}`);
        }

        if (values.filterSize) {
            args.push(`-fs`, `${values.filterSize}`);
        }

        if (values.filterWords) {
            args.push(`-fw`, `${values.filterWords}`);
        }

        if (values.filterLines) {
            args.push(`-fl`, `${values.filterLines}`);
        }

        if (checkedStopWhen) {
            args.push(`-sf`);
        }

        if (checkedVerboseOutput) {
            args.push(`-v`);
        }

        try {
            const result = await CommandHelper.runCommandGetPidAndOutput(
                "ffuf",
                args,
                handleProcessData,
                handleProcessTermination
            );
            setPid(result.pid);
            setOutput(result.output);
        } catch (e: any) {
            setOutput(e.message);
        }
    };

    /**
     * Clears the output state.
     */
    const clearOutput = useCallback(() => {
        setOutput("");
        setHasSaved(false);
        setAllowSave(false);
    }, [setOutput]);

    return (
        <RenderComponent
            title={title}
            description={description}
            steps={steps}
            tutorial={tutorial}
            sourceLink={sourceLink}
        >
            {!loadingModal && (
                <InstallationModal
                    isOpen={opened}
                    setOpened={setOpened}
                    feature_description={description}
                    dependencies={dependencies}
                ></InstallationModal>
            )}
            <form onSubmit={form.onSubmit((values) => onSubmit({ ...values }))}>
                {LoadingOverlayAndCancelButton(loading, pid)}
                <Stack>
                    <Switch
                        size="md"
                        label="Advanced Mode"
                        checked={checkedAdvanced}
                        onChange={(e) => setCheckedAdvanced(e.currentTarget.checked)}
                    />
                    <TextInput
                        label={"Target URL"}
                        placeholder={"https://www.example.com"}
                        required
                        {...form.getInputProps("url")}
                    />
                    <TextInput
                        label={"Wordlist: default is directory-list-2.3-medium.txt by SecLists"}
                        placeholder={"wordlist.txt"}
                        {...form.getInputProps("wordlist")}
                    />
                    <TextInput
                        label={"Extensions"}
                        placeholder={".html,.txt,.php"}
                        {...form.getInputProps("extensions")}
                    />
                    {checkedAdvanced && (
                        <>
                            <TextInput label={"Optional Output File"} {...form.getInputProps("output")} />

                            <TextInput
                                label={"Filter HTTP response size. Comma separated list of sizes and ranges"}
                                {...form.getInputProps("filtersize")}
                            />

                            <TextInput
                                label={
                                    "Filter by amount of words in response. Comma separated list of word counts and ranges"
                                }
                                {...form.getInputProps("filterwords")}
                            />

                            <TextInput
                                label={
                                    "Filter by amount of lines in response. Comma separated list of line counts and ranges"
                                }
                                {...form.getInputProps("filterlines")}
                            />
                        </>
                    )}
                    <Group grow>
                        <Switch
                            size="md"
                            label="Stop when > 95% of responses return 403 Forbidden"
                            checked={checkedStopWhen}
                            onChange={(e) => setCheckedStopWhen(e.currentTarget.checked)}
                        />
                        <Switch
                            size="md"
                            label="Verbose Output"
                            checked={checkedVerboseOutput}
                            onChange={(e) => setCheckedVerboseOutput(e.currentTarget.checked)}
                        />
                    </Group>
                    <Button type={"submit"}>Scan</Button>
                    {SaveOutputToTextFile_v2(output, allowSave, hasSaved, handleSaveComplete)}
                    <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
                </Stack>
            </form>
        </RenderComponent>
    );
};

export default FfufTool;

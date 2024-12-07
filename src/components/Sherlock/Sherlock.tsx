import { Button, Checkbox, Stack, TextInput, Switch } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useState } from "react";
import { CommandHelper } from "../../utils/CommandHelper";
import ConsoleWrapper from "../ConsoleWrapper/ConsoleWrapper";
import { RenderComponent } from "../UserGuide/UserGuide";
import { SaveOutputToTextFile_v2 } from "../SaveOutputToFile/SaveOutputToTextFile";
import { LoadingOverlayAndCancelButton } from "../OverlayAndCancelButton/OverlayAndCancelButton";

/**
 * Represents the form values for the Sherlock component.
 */
interface FormValuesType {
    username: string;
    site: string;
    timeout: number;
}

/**
 * The Sherlock Component
 * @returns The Sherlock component.
 */
const Sherlock = () => {
    // Component State Variables
    const [loading, setLoading] = useState(false); // Indicates loading state
    const [output, setOutput] = useState(""); // Stores command execution output
    const [checkedAdvanced, setCheckedAdvanced] = useState(false); // Toggle for advanced mode
    const [checkedVerbose, setCheckedVerbose] = useState(false); // Toggle for verbose mode
    const [pid, setPid] = useState(""); // Process ID of the command execution
    const [allowSave, setAllowSave] = useState(false); // Allow saving output state
    const [hasSaved, setHasSaved] = useState(false); // Indicates whether output has been saved

    // Component Constants
    const title = "Sherlock Tool"; // Title of the component
    const description =
        "Sherlock is a tool used for searching social networks for specified usernames.\n\n" +
        "Further information can be found at: https://www.kali.org/tools/sherlock/\n\n" +
        "Using Sherlock:\n\n";

    const steps =
        "*Note: For multiple usernames, add a space in between. E.g. 'Greg John Billy'*\n\n" +
        "Step 1: Input the username(s) you wish to search for in the Username field.\n" +
        "       Eg: socialperson38\n\n" +
        "Step 2: Click Start Searching to commence Sherlock's operation.\n\n" +
        "Step 3: View the Output block below to view the results of the tool's execution.";

    const sourceLink = "https://www.kali.org/tools/sherlock/";
    const tutorial = "https://docs.google.com/document/d/13P51Pa0k0NUEV0FNueRp4mAUjvc2mLNatKkrlkIcz20/edit?usp=sharing"; // No specific tutorial URL available
    const dependencies = ["sherlock"]; // Contains required dependencies

    // Form hook to manage form input
    const form = useForm({
        initialValues: {
            username: "", // Initial username field
            site: "", // Initial site field
            timeout: 60, // Default timeout value
        },
    });

    /**
     * handleProcessData: Callback to handle and append new data from the process to the output.
     * @param {string} data - The data received from the child process.
     */
    const handleProcessData = useCallback((data: string) => {
        setOutput((prevOutput) => prevOutput + "\n" + data); // Append data to previous output
    }, []);

    /**
     * handleProcessTermination: Handles the termination of the process.
     * @param {object} param - An object containing process termination info.
     * @param {number} param.code - The exit code of the terminated process.
     * @param {number} param.signal - The signal code indicating how the process was terminated.
     */
    const handleProcessTermination = useCallback(
        ({ code, signal }: { code: number; signal: number }) => {
            // Process completed successfully
            if (code === 0) {
                handleProcessData("\nProcess completed successfully.");
                // Process was manually terminated
            } else if (signal === 15) {
                handleProcessData("\nProcess was manually terminated.");
                // Process terminated with an error
            } else {
                handleProcessData(`\nProcess terminated with exit code: ${code} and signal code: ${signal}`);
            }

            // Clear the child process PID reference
            setPid("");
            // Cancel the loading overlay
            setLoading(false);
            // Allow saving after process is finalized
            setAllowSave(true);
            setHasSaved(false);
        },
        [handleProcessData]
    );

    /**
     * handleSaveComplete: Actions taken after saving the output.
     */
    const handleSaveComplete = () => {
        // Indicate that the file has been saved
        setHasSaved(true);
        setAllowSave(false);
    };

    /**
     * onSubmit: Asynchronous handler for form submission.
     * Triggers the sherlock tool with provided parameters.
     * @param {FormValuesType} values - The form values containing the username(s), site, and timeout.
     */
    const onSubmit = async (values: FormValuesType) => {
        // Activate loading state
        setLoading(true);
        // Disallow saving until tool execution is complete
        setAllowSave(false);

        // Construct arguments for Sherlock tool
        const args = [];
        if (checkedVerbose) {
            args.push("--verbose");
        }
        if (values.site) {
            args.push("--site", `${values.site}`);
        }
        if (values.timeout) {
            args.push("--timeout", `${values.timeout}`);
        }
        args.push(...values.username.split(" "));

        // Run the Sherlock tool using the helper method
        try {
            const result = await CommandHelper.runCommandGetPidAndOutput(
                "sherlock",
                args,
                handleProcessData,
                handleProcessTermination
            );
            setPid(result.pid); // Set process ID
            setOutput(result.output); // Set command output
        } catch (e: any) {
            setOutput(e.message); // Display error message if command execution fails
            setLoading(false); // Stop loading
        }
    };

    /**
     * clearOutput: Clears the output state.
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
            <form onSubmit={form.onSubmit(onSubmit)}>
                <Stack>
                    {LoadingOverlayAndCancelButton(loading, pid)}
                    <TextInput
                        label={"Username"}
                        placeholder="For multiple usernames, leave space between each."
                        required
                        {...form.getInputProps("username")}
                    />
                    <Switch
                        size="md"
                        label="Advanced Mode"
                        checked={checkedAdvanced}
                        onChange={(e) => setCheckedAdvanced(e.currentTarget.checked)}
                    />
                    {checkedAdvanced && (
                        <>
                            <TextInput
                                label={"Timeout"}
                                placeholder={"Time (in seconds) to wait for response to requests. Default is 60."}
                                {...form.getInputProps("timeout")}
                            />
                            <TextInput
                                label={"Site"}
                                placeholder={"Specific social networking site to search on."}
                                {...form.getInputProps("site")}
                            />
                            <Checkbox
                                label={"Display detailed information about the search process."}
                                checked={checkedVerbose}
                                onChange={(e) => setCheckedVerbose(e.currentTarget.checked)}
                            />
                        </>
                    )}
                    <Button type={"submit"}>Start Searching!</Button>
                    {SaveOutputToTextFile_v2(output, allowSave, hasSaved, handleSaveComplete)}
                    <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
                </Stack>
            </form>
        </RenderComponent>
    );
};

export default Sherlock;

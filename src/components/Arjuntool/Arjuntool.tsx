import { Button, Stack, TextInput, Switch } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useState, useEffect } from "react";
import { CommandHelper } from "../../utils/CommandHelper";
import ConsoleWrapper from "../ConsoleWrapper/ConsoleWrapper";
import { LoadingOverlayAndCancelButton } from "../OverlayAndCancelButton/OverlayAndCancelButton";
import { SaveOutputToTextFile_v2 } from "../SaveOutputToFile/SaveOutputToTextFile";
import { checkAllCommandsAvailability } from "../../utils/CommandAvailability";
import InstallationModal from "../InstallationModal/InstallationModal";
import { RenderComponent } from "../UserGuide/UserGuide";

const title = "Arjun";
const dependencies = ["arjun"]; // Contains the dependencies required for the component
const description =
    "Arjun is  command-line tool for discovering hidden HTTP parameters. It supports multiple methods and handles rate limits efficiently.";
const steps = [
    "Step 1: Enter a valid URL. E.g. https://www.deakin.edu.au.",
    "Step 2: Enter an optional JSON output filename. E.g. arjunoutput.",
    "Step 3: Click the scan button to commence scanning.",
    "Step 4: View the output block below to see the results.",
];
const sourceLink = "https://github.com/s0md3v/Arjun"; // Link to the source code repository
const tutorial = "https://www.geeksforgeeks.org/arjun-hidden-http-parameter-discovery-suite-in-kali-linux/"; // Link to the tutorial

/**
 * Represents the form values for the Arjun component.
 */
interface FormValues {
    url: string;
    outputFileName: string;
    stability: boolean;
}

function Arjuntool() {
    // Component State Variables
    const [loading, setLoading] = useState(false); // State variable to indicate loading state
    const [output, setOutput] = useState(""); // State variable to store the output of the command execution
    const [pid, setPid] = useState(""); // State variable to store the process ID of the command execution
    const [allowSave, setAllowSave] = useState(false); // State variable to allow saving the output to a file
    const [hasSaved, setHasSaved] = useState(false); // State variable to indicate if the output has been saved
    const [isCommandAvailable, setIsCommandAvailable] = useState(false); // State variable to check if the command is available
    const [opened, setOpened] = useState(!isCommandAvailable); // State variable that indicates if the modal is opened
    const [loadingModal, setLoadingModal] = useState(true); // State variable to indicate loading state of the modal

    // Check if the command is available and set the state variables accordingly.
    useEffect(() => {
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

    // Form Hook to handle form input.
    let form = useForm({
        initialValues: {
            url: "",
            outputFileName: "",
            stability: false,
        },
    });

    /**
     * handleProcessData: Callback to handle and append new data from the child process to the output.
     * It updates the state by appending the new data received to the existing output.
     * @param {string} data - The data received from the child process.
     */
    const handleProcessData = useCallback((data: string) => {
        setOutput((prevOutput) => prevOutput + "\n" + data); // Append new data to the previous output.
    }, []);

    /**
     * handleProcessTermination: Callback to handle the termination of the child process.
     * Once the process termination is handled, it clears the process PID reference and
     * deactivates the loading overlay.
     * @param {object} param - An object containing information about the process termination.
     * @param {number} param.code - The exit code of the terminated process.
     * @param {number} param.signal - The signal code indicating how the process was terminated.
     */
    const handleProcessTermination = useCallback(
        ({ code, signal }: { code: number; signal: number }) => {
            // If the process was terminated successfully, display a success message.
            if (code === 0) {
                handleProcessData("\nProcess completed successfully.");
                // If the process was terminated due to a signal, display the signal code.
            } else if (signal === 15) {
                handleProcessData("\nProcess was manually terminated.");
                // If the process was terminated with an error, display the exit code and signal code.
            } else {
                handleProcessData(`\nProcess terminated with exit code: ${code} and signal code: ${signal}`);
            }

            // Clear the child process pid reference. There is no longer a valid process running.
            setPid("");

            // Cancel the loading overlay. The process has completed.
            setLoading(false);

            // Now that loading has completed, allow the user to save the output to a file.
            setAllowSave(true);
            setHasSaved(false);
        },
        [handleProcessData] // Dependency on the handleProcessData callback
    );

    // Actions taken after saving the output
    const handleSaveComplete = () => {
        // Indicating that the file has saved which is passed
        // back into SaveOutputToTextFile to inform the user
        setHasSaved(true);
        setAllowSave(false);
    };

    /**
     * onSubmit: Handles form submission, executes the Arjun command, and updates the output state.
     * @param {FormValues} values - The form values.
     */
    const onSubmit = async (values: FormValues) => {
        // Disallow saving until the tool's execution is complete
        setAllowSave(false);

        // Activate loading state to indicate ongoing process
        setLoading(true);

        // Construct arguments for the arjun command based on form input
        const args = ["-u", values.url];

        // Conditional. If the user has specified stability, add the --stable option to the command.
        if (values.stability) {
            args.push("--stable");
        }
        if (values.outputFileName) {
            args.push("-o", values.outputFileName);
        }

        // Execute the arjun command via helper method and handle its output or potential errors
        CommandHelper.runCommandGetPidAndOutput("arjun", args, handleProcessData, handleProcessTermination)
            .then(({ pid, output }) => {
                // Update the output with the results of the command execution.
                setOutput(output);

                // Store the process ID of the executed command.
                setPid(pid);
            })
            .catch((error) => {
                // Display any errors encountered during command execution.
                setOutput(error.message);

                // Deactivate loading state.
                setLoading(false);
            });
    };

    /**
     * clearOutput: Callback function to clear the console output.
     * It resets the state variable holding the output, thereby clearing the display.
     */
    const clearOutput = useCallback(() => {
        setOutput("");
        setHasSaved(false);
        setAllowSave(false);
    }, [setOutput]);

    return (
        <>
            {!loadingModal && (
                <InstallationModal
                    isOpen={opened}
                    setOpened={setOpened}
                    feature_description={description}
                    dependencies={dependencies}
                />
            )}
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
                {LoadingOverlayAndCancelButton(loading, pid)}
                <Stack>
                    <RenderComponent
                        title={title}
                        description={description}
                        steps={steps.join("\n")}
                        tutorial={tutorial}
                        sourceLink={sourceLink}
                    >
                        {/* Children content or an empty fragment can go here */}
                        <>{/* Additional configuration or instructions can be placed here */}</>
                    </RenderComponent>
                    <TextInput label={"URL"} required {...form.getInputProps("url")} />
                    <Switch size="md" label="Stability mode" {...form.getInputProps("stability" as keyof FormValues)} />
                    <Button type={"submit"}>Scan</Button>
                    {SaveOutputToTextFile_v2(output, allowSave, hasSaved, handleSaveComplete)}
                    <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
                </Stack>
            </form>
        </>
    );
}

export default Arjuntool;

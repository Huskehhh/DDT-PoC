import { Button, NativeSelect, Input, Stack, Textarea, TextInput, Switch } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useState, useEffect } from "react";
import { CommandHelper } from "../../utils/CommandHelper";
import { checkAllCommandsAvailability } from "../../utils/CommandAvailability";
import InstallationModal from "../InstallationModal/InstallationModal";
import { LoadingOverlayAndCancelButtonPkexec } from "../OverlayAndCancelButton/OverlayAndCancelButton";
import ConsoleWrapper from "../ConsoleWrapper/ConsoleWrapper";
import { UserGuide } from "../UserGuide/UserGuide";
import { RenderComponent } from "../UserGuide/UserGuide";
import { SaveOutputToTextFile_v2 } from "../SaveOutputToFile/SaveOutputToTextFile";

/**
 * Represents the form values for the Firmware Analysis Toolkit component.
 */
interface FormValuesType {
    firmwarePath: string;
}

/**
 * The FirmwareAnalysisToolkit component.
 * @returns The FirmwareAnalysisToolkit component.
 */
const FirmwareAnalysisToolkit = () => {
    // Component State Variables.
    const [loading, setLoading] = useState(false); // State variable to indicate loading state.
    const [output, setOutput] = useState(""); // State variable to store the output of the command execution.
    const [isCommandAvailable, setIsCommandAvailable] = useState(false); // State variable to check if the command is available.
    const [loadingModal, setLoadingModal] = useState(true); // State variable that indicates if the modal is opened.
    const [opened, setOpened] = useState(!isCommandAvailable); // State variable to indicate loading state of the modal.
    const [allowSave, setAllowSave] = useState(false); // State variable to indicate if saving is allowed
    const [hasSaved, setHasSaved] = useState(false); // State variable to indicate if the output has been saved
    const [pid, setPid] = useState<number | null>(null); // State variable for process ID, expects number or null

    // Component Constants.
    const title = "Firmware Analysis Toolkit"; // Title of the component.
    const description =
        "This component provides a user interface to interact with the Firmware Analysis Toolkit, which can be used to extract, identify architecture, build QEMU disk image, and infer network connection of a firmware image."; // Description of the component.
    const steps =
        "Step 1: Enter the path to the firmware image file.\n" +
        "Step 2: Click Analyze Firmware to initiate the analysis process.\n" +
        "Step 3: View the Output block below to see the results of the analysis.";
    const tutorial = "";
    const sourceLink = "https://github.com/attify/firmware-analysis-toolkit"; // Link to the source code.
    const dependencies = [
        "python3",
        "/home/kali/Deakin-Detonator-Toolkit/src-tauri/exploits/firmware-analysis-toolkit/fat.py",
    ];

    // Form hook to handle form input.
    let form = useForm({
        initialValues: {
            firmwarePath: "",
        },
    });

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
    const handleProcessTermination = useCallback(({ code, signal }: { code: number; signal: number }) => {
        setLoading(false); // Stop loading state on termination (success/error)
        setPid(null); // Clear the pid
    }, []);

    /**
     * onSubmit: Asynchronous handler for the form submission event.
     * It constructs arguments for the firmadyne tool and executes the analysis process.
     * Once the command is executed, the results or errors are displayed in the output.
     *
     * @param {FormValuesType} values - The form values, containing the firmwarePath
     */
    const onSubmit = async (values: FormValuesType) => {
        // Activate loading state to indicate ongoing process
        setLoading(true);

        // Construct arguments for the firmadyne tool based on form input
        const args = [
            "/home/kali/Deakin-Detonator-Toolkit/src-tauri/exploits/firmware-analysis-toolkit/fat.py",
            values.firmwarePath,
        ];

        try {
            // Execute the firmadyne command via helper method and handle its output or potential errors
            const result = await CommandHelper.runCommandWithPkexec(
                "python3",
                args,
                handleProcessData,
                handleProcessTermination
            );

            // Ensure result.pid is converted to a number before setting the state
            setPid(result.pid ? Number(result.pid) : null);

            // Update the UI with the results from the executed command
            setOutput(result.output);
        } catch (e: any) {
            // Display any errors encountered during command execution
            setOutput(e.message);
            // Deactivate loading state
            setLoading(false);
        } finally {
            // Allow Saving as the output is finalized
            setAllowSave(true);
            setHasSaved(false);
        }
    };

    /**
     * handleSaveComplete: Handler for the completion of saving the output to a file.
     */
    const handleSaveComplete = () => {
        setHasSaved(true); // Mark that the file has been saved
    };

    /**
     * Clears the output state.
     */
    const clearOutput = useCallback(() => {
        setOutput("");

        // Disallow saving when output is cleared
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
            <form onSubmit={form.onSubmit(onSubmit)}>
                <Stack>
                    {/* Ensure pid is a string when passed into LoadingOverlayAndCancelButtonPkexec */}
                    {LoadingOverlayAndCancelButtonPkexec(
                        loading,
                        pid ? String(pid) : "",
                        handleProcessData,
                        handleProcessTermination
                    )}
                    <TextInput
                        label={"Path to Firmware File"}
                        placeholder={"Enter the path to the firmware file"}
                        required
                        {...form.getInputProps("firmwarePath")}
                    />
                    <Button type={"submit"}>Analyze Firmware</Button>
                    {SaveOutputToTextFile_v2(output, allowSave, hasSaved, handleSaveComplete)}
                    <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
                </Stack>
            </form>
        </RenderComponent>
    );
};

export default FirmwareAnalysisToolkit;

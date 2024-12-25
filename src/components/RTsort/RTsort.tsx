import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useState, useEffect } from "react";
import { CommandHelper } from "../../utils/CommandHelper";
import ConsoleWrapper from "../ConsoleWrapper/ConsoleWrapper";
import { SaveOutputToTextFile_v2 } from "../SaveOutputToFile/SaveOutputToTextFile";
import { RenderComponent } from "../UserGuide/UserGuide";
import { LoadingOverlayAndCancelButton } from "../OverlayAndCancelButton/OverlayAndCancelButton";
import InstallationModal from "../InstallationModal/InstallationModal";
import { checkAllCommandsAvailability } from "../../utils/CommandAvailability";
import { FilePicker } from "../FileHandler/FilePicker";

/**
 * Represents the form values for the RTsort component.
 */
interface FormValuesType {
    path: string;
}

//Deals with the generatedfilepath unique identifier that is added at the end of a file
const cleanFileName = (filePath: string): string => {
    // Split the file name by the underscore (_) and keep the first part (before the timestamp/ID)
    const parts = filePath.split("_");

    // Keep only the base file name (before the timestamp and unique identifier)
    const baseFileName = parts[0];
    return baseFileName;
};

// Function for implementing RTSort as GUI component
const RTSort = () => {
    // Component state variables
    const [loading, setLoading] = useState(false); // State variable to indicate loading state.
    const [output, setOutput] = useState(""); // State variable to store the output of the command execution.
    const [pid, setPid] = useState(""); //  State variable to store the process ID of the command execution.
    const [allowSave, setAllowSave] = useState(false); //   State variable to allow saving the output to a file.
    const [hasSaved, setHasSaved] = useState(false); // State variable to indicate if the output has been saved.
    const [loadingModal, setLoadingModal] = useState(true); // State variable to indicate loading state of the modal.
    const [isCommandAvailable, setIsCommandAvailable] = useState(false); // State variable to check if the command is available.
    const [opened, setOpened] = useState(!isCommandAvailable); // State variable that indicates if the modal is opened.
    const [fileNames, setFileNames] = useState<string[]>([]); // State variable to store the file names.

    // Component Constants.
    const title = "Rainbow Table Sort"; // Title of the component.
    const description =
        "RTSort is a sub-function of the Rainbowcrack tool. This function sorts created rainbow tables."; // Description of the component.
    const steps =
        "Step 1: Specify the filepath to the rainbow table file that you wish to sort (e.g ~/ntlm_loweralpha-numeric#1-9_0_1000x1000_0.rt).\n" +
        "Step 2: Click 'Start Sort'.\n" +
        "Step 3: View the output block to view the results of the tool's execution.\n";

    const sourceLink = "https://gitlab.com/kalilinux/packages/rainbowcrack"; // Link to the source code (or Kali Tools).
    const tutorial = "https://docs.google.com/document/d/1d_DmZxMeOaoJexz5mNqXMXd48rmTCWjwYAQg-Eyu7Qs/edit?usp=sharing"; // Link to the official documentation/tutorial.
    const dependencies = ["rcrack"]; // Contains the dependencies required by the component.

    // Form hook to handle form input.
    let form = useForm({
        initialValues: {
            path: "./",
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

    /** *
     * handleProcessData: Callback to handle and append new data from the child process to the output.
     *  It updates the state by appending the new data received to the existing output.
     *  @param {string} data - The data received from the child process.
     * */
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
            // If the process was successful, display a success message.
            if (code === 0) {
                handleProcessData("\nProcess completed successfully.");

                // If the process was terminated manually, display a termination message.
            } else if (signal === 15) {
                handleProcessData("\nProcess was manually terminated.");

                // If the process was terminated with an error, display the exit and signal codes.
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
        [handleProcessData] // Dependency on the handleProcessData callback
    );

    /**
     * onSubmit: Asynchronous handler for the form submission event.
     * It sets up and triggers the rt-sort tool with the given parameters.
     * Once the command is executed, the results or errors are displayed in the output.
     *
     * @param {FormValuesType} values - The form value, containing path.
     */
    const onSubmit = async (values: FormValuesType) => {
        // Activate loading state to indicate ongoing process
        setLoading(true);
        // Disallow saving until the tool's execution is complete
        setAllowSave(false);

        const baseFilePath = "/home/kali";
        const fileToSend = fileNames[0];
        const cleanName = cleanFileName(fileToSend);

        // Concatenate the base file path with the cleaned file name
        const dataUploadPath = `${baseFilePath}/${cleanName}`;

        // Construct arguments for the RTsort command based on form input
        const args = [values.path];
        const filteredArgs = args.filter((arg) => arg !== ""); // Variable to store non empty string as argument

        // Please note this command should not be cancelled as this will cause the rainbow table to be corrupted
        // Execute the aircrack-ng command via helper method and handle its output or potential errors
        try {
            // Execute the artsort command via helper method and handle its output or potential errors
            const result = await CommandHelper.runCommandGetPidAndOutput(
                "rtsort",
                filteredArgs,
                handleProcessData,
                handleProcessTermination
            );
            // Update the UI with the results from the executed command
            setPid(result.pid);
            setOutput(result.output);
            // Enable setAllowSave to generate output file
            setAllowSave(true);
        } catch (e: any) {
            setOutput(e);
            // Disallow save after the output
            setAllowSave(false);
        }
    };
    /**
     * Clears the output state.
     */
    const clearOutput = useCallback(() => {
        setOutput("");
        setAllowSave(false);
        setHasSaved(false);
    }, [setOutput]);

    const handleSaveComplete = useCallback(() => {
        setHasSaved(true);
        setAllowSave(false);
    }, []);

    // placeholder="/home/user/rainbowcrack/tables/ntlm_loweralpha-numeric#1-9_0_1000x1000_0.rt"
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
                {LoadingOverlayAndCancelButton(loading, pid)}
                <Stack>
                    <FilePicker
                        fileNames={fileNames}
                        setFileNames={setFileNames}
                        multiple={false}
                        componentName="RTsort"
                        labelText="Select File (Can only select files in /home/kali)"
                        placeholderText="Click to select file(s)"
                    />
                    <Button type={"submit"}>Start Sort</Button>
                    {SaveOutputToTextFile_v2(output, allowSave, hasSaved, handleSaveComplete)}
                    <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
                </Stack>
            </form>
        </RenderComponent>
    );
};

export default RTSort;

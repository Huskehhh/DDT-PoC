import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useState } from "react";
import { CommandHelper } from "../../utils/CommandHelper";
import ConsoleWrapper from "../ConsoleWrapper/ConsoleWrapper";
import { UserGuide } from "../UserGuide/UserGuide";
import { SaveOutputToTextFile_v2 } from "../SaveOutputToFile/SaveOutputToTextFile";
import { LoadingOverlayAndCancelButton } from "../OverlayAndCancelButton/OverlayAndCancelButton";

// Constants and Static Values
const title = "EyeWitness";
const description_userguide =
    "EyeWitness takes screenshots of websites, provides information about the server header, and identifies default credentials (if known). It presents this information in a HTML report. " +
    "\n\nEyeWitness's information page: https://www.kali.org/tools/eyewitness/#eyewitness" +
    "\n\nHow to use EyeWitness:" +
    "\n\nStep 1: Create a plain text file on your local drive and add URLs to it. Each URL must be on its own line. Add the file path to the text file in the first field." +
    "\n\nStep 2: Add the file path for where you want the output saved in the second field." +
    "\n\nStep 3: Add a number in the third field for the maximum number of seconds for EyeWitness to try and screenshot a webpage, e.g. 20. " +
    "\n\nStep 4: Press the scan button. ";

// Interface Definitions
interface FormValues {
    /**
     * Represents the form values for the EyeWitness component.
     *
     * @property {string} filepath - The path to the file containing URLs to be processed by EyeWitness.
     * @property {string} directory - The directory path where screenshots will be saved.
     * @property {string} timeout - The maximum number of seconds for EyeWitness to try and screenshot a webpage.
     */
    filepath: string;
    directory: string;
    timeout: string;
}

export function Eyewitness() {
    // State Variables
    const [loading, setLoading] = useState(false);  // Controls the loading state of the component
    const [output, setOutput] = useState("");       // Stores the output generated by the command
    const [pid, setPid] = useState("");             // Stores the PID of the running command process
    const [allowSave, setAllowSave] = useState(false); // Determines whether saving the output is allowed
    const [hasSaved, setHasSaved] = useState(false);  // Indicates whether the output has been saved

    let form = useForm({
        initialValues: {
            filepath: "",
            directory: "",
            timeout: "",
        },
    });

    // Uses the callback function of runCommandGetPidAndOutput to handle and save data
    // generated by the executing process into the output state variable.
    /**
    * Handles the data received from the subprocess and appends it to the output.
    *
    * @param {string} data - The string data received from the subprocess.
    */
    const handleProcessData = useCallback((data: string) => {
        setOutput((prevOutput) => prevOutput + "\n" + data); // Update output
    }, []);
    // Uses the onTermination callback function of runCommandGetPidAndOutput to handle
    // the termination of that process, resetting state variables, handling the output data,
    // and informing the user.
    /**
    * Handles the termination of the subprocess, updating the state and processing the output data.
    *
    * @param {object} params - The termination event parameters.
    * @param {number} params.code - The exit code of the subprocess.
    * @param {number} params.signal - The termination signal code.
    */
    const handleProcessTermination = useCallback(
        ({ code, signal }: { code: number; signal: number }) => {
            if (code === 0) {
                handleProcessData("\nProcess completed successfully.");  // Successful completion message
            } else if (signal === 15) {
                handleProcessData("\nProcess was manually terminated."); // Manual termination message
            } else {
                handleProcessData(`\nProcess terminated with exit code: ${code} and signal code: ${signal}`); // Error message
            }
            
            setPid("");        // Clear the child process pid reference
            setLoading(false); // Cancel the Loading Overlay
            setAllowSave(true); // Allow Saving as the output is finalised
            setHasSaved(false); // Reset save status
        },
        [handleProcessData]
    );

    // Actions taken after saving the output
    /**
    * Handles the state updates after a save operation is completed.
    * Allows saving and indicates that the save has been completed.
    */
    const handleSaveComplete = () => {
        // Indicating that the file has saved which is passed
        // back into SaveOutputToTextFile to inform the user
        setHasSaved(true); 
        setAllowSave(false);
    };
    /**
    * Handles form submission, executes the EyeWitness tool, and updates the state.
    *
    * @param {FormValues} values - The form input values.
    * @returns {Promise<void>} - An asynchronous operation.
    */
    const onSubmit = async (values: FormValues) => {
        
        setAllowSave(false); // Disallow saving until the tool's execution is complete
        
        setLoading(true);  // Enable the Loading Overlay

        const args = [`-f`, `${values.filepath}`];
        args.push(`--web`);
        args.push(`-d`, `${values.directory}`);
        args.push(`--timeout`, `${values.timeout}`);
        args.push(`--no-prompt`);

        CommandHelper.runCommandGetPidAndOutput("eyewitness", args, handleProcessData, handleProcessTermination)
            .then(({ pid, output }) => {
                setPid(pid);
                setOutput(output);
            })
            .catch((error) => {
                setLoading(false); // Cancel the Loading Overlay
                setOutput(`Error: ${error.message}`); // Set the error message
            });
    };
     /**
     * Clears the output data and resets the save state.
     */
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
                <TextInput
                    label={"Enter the file name or path containing URLs:"}
                    placeholder={"Example: /home/kali/Desktop/filename"}
                    required
                    {...form.getInputProps("filepath")}
                />
                <TextInput
                    label={"Enter the directory name where you want to save screenshots or define path of directory:"}
                    placeholder={"Example: /home/kali/Directory name"}
                    required
                    {...form.getInputProps("directory")}
                />
                <TextInput label={"Enter the timeout time"} required {...form.getInputProps("timeout")} />
                {SaveOutputToTextFile_v2(output, allowSave, hasSaved, handleSaveComplete)}
                <Button type={"submit"}>Scan</Button>
                {SaveOutputToTextFile_v2(output, allowSave, hasSaved, handleSaveComplete)}
                <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
            </Stack>
        </form>
    );
}
export default Eyewitness;

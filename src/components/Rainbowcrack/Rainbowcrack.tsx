import { Button, Stack, TextInput, Text } from "@mantine/core";
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
 * Represents the form values for the RainbowCrack component.
 */
interface FormValuesType {
    hashValue: string;
}

/**
 * The RainbowCrack component.
 * @returns The RainbowCrack component.
 */
const RainbowCrack = () => {
    // Component State Variables
    const [loading, setLoading] = useState(false); // State variable to indicate loading state.
    const [output, setOutput] = useState(""); // State variable to store the output of the command execution.
    const [pid, setPid] = useState(""); // State variable to store the process ID of the command execution.
    const [isCommandAvailable, setIsCommandAvailable] = useState(false); // State variable to check if the command is available.
    const [opened, setOpened] = useState(!isCommandAvailable); // State variable that indicates if the modal is opened.
    const [loadingModal, setLoadingModal] = useState(true); // State variable to indicate loading state of the modal.
    const [allowSave, setAllowSave] = useState(false); // State variable to enable/disable saving
    const [hasSaved, setHasSaved] = useState(false); // State variable to track whether output has been saved
    const [hashError, setHashError] = useState("");

    // Component Constants
    const title = "RainbowCrack"; // Title of the component

    const description =
        "RainbowCrack is a command line tool that uses rainbow tables to crack password hashes. It supports multiple hash algorithms, including LM, NTLM, MD5, SHA1 and SHA256."; // Description of the component.

    const steps =
        "How to use RainbowCrack:\n" +
        "Step 1: Ensure that your rainbow tables (*.rt, *.rtc) are stored in a directory.\n" +
        "Step 2: Enter the hash value you want to crack in the input field. For a single hash, use the format: ./rcrack [path to tables] -h [hash].\n" +
        "   - Example: ./rcrack . -h 5d41402abc4b2a76b9719d911017c592\n" +
        "Step 3: To crack multiple hashes from a file, use the format: ./rcrack [path to tables] -l [hash_list_file].\n" +
        "   - Example: ./rcrack . -l hash.txt\n" +
        "Step 4: If you have LM hashes in a pwdump file, use the format: ./rcrack [path to tables] -lm [pwdump_file].\n" +
        "   - Example: ./rcrack . -lm pwdump.txt\n" +
        "Step 5: For NTLM hashes in a pwdump file, use the format: ./rcrack [path to tables] -ntlm [pwdump_file].\n" +
        "   - Example: ./rcrack . -ntlm pwdump.txt\n" +
        "Step 6: Click the Crack " +
        title +
        " button to execute the command and display the results."; // Steps to use the component.
    const sourceLink = "http://project-rainbowcrack.com/"; // Link to the source code (or RainbowCrack documentation).
    const tutorial = ""; // Link to the official documentation/tutorial.

    const dependencies = ["rainbowcrack"]; // Dependencies required by the component.just check

    // Form hook to handle form input.
    const form = useForm({
        initialValues: {
            hashValue: "",
        },
    });

    // Check if the command is available and set state variables accordingly.
    useEffect(() => {
        checkAllCommandsAvailability(dependencies)
            .then((isAvailable) => {
                setIsCommandAvailable(isAvailable);
                setOpened(!isAvailable);
                setLoadingModal(false);
            })
            .catch((error) => {
                console.error("An error occurred:", error);
                setLoadingModal(false);
            });
    }, []);

    /**
     * handleProcessData:Callback to handle and append new data from the child process to the output.
     * @param {string} data - The data received from the child process.
     */
    const validateHash = (data: string) => {
        //Basic hash formatvalidation: Checks for hexadecimal characters and typical lengths(32,42,64,etc.)
        const hashRegex = /^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/;

        if (!hashRegex.test(data)) {
            setHashError("Invalid hash format. Please ensure it is a valid 32,40, or 64 character hexadecimal hash. ");
        } else {
            setHashError("");
        }
    };
    const handleHashChange = (event: any) => {
        const { value } = event.currentTarget;
        form.setFieldValue("hashValue", value);
        validateHash(value); // Call the validation function on each input change
    };

    const handleProcessData = useCallback((data: string) => {
        setOutput((prevOutput: string): string => prevOutput + "\n" + data); // Append new data to the previous output.
    }, []);

    /**
     * handleProcessTermination: Callback to handle the termination of the child process.
     * @param {object} param - An object containing information about the process termination.
     * @param {number} param.code - The exit code of the terminated process.
     * @param {number} param.signal - The signal code indicating how the process was terminated.
     */
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
        },
        [handleProcessData]
    );

    /**
     * onSubmit: Asynchronous handler for the form submission event.
     * @param {FormValuesType} values - The form values.
     */
    const onSubmit = async (values: FormValuesType) => {
        if (hashError) return; //Prevent form submission if there's a validation error
        setLoading(true);

        // Construct arguments for rainbowcrack command based on form input
        const args = [values.hashValue];

        // Execute the rainbowcrack command via helper method
        CommandHelper.runCommandGetPidAndOutput("rcrack", args, handleProcessData, handleProcessTermination)
            .then(({ output, pid }) => {
                setOutput(output);
                console.log(pid);
                setPid(pid);
            })
            .catch((error) => {
                setOutput(error.message);
                setLoading(false);
            });
    };

    /**
     * Clears the output state.
     */
    const clearOutput = useCallback(() => {
        setOutput("");
    }, [setOutput]);

    const handleSaveComplete = () => {
        // This function could handle any actions needed after saving the output
        setHasSaved(true);
    };
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
                />
            )}
            <form onSubmit={form.onSubmit(onSubmit)}>
                <Stack>
                    {LoadingOverlayAndCancelButton(loading, pid)}
                    <TextInput
                        label="Hash Value"
                        required
                        {...form.getInputProps("hashValue")}
                        onChange={handleHashChange} //Update the onChange handler
                        error={hashError && <Text color="red">{hashError}</Text>} // Display the error message
                    />
                    {SaveOutputToTextFile_v2(output, allowSave, hasSaved, handleSaveComplete)}
                    <Button type="submit" disabled={!!hashError}>
                        Crack
                    </Button>
                    {/*Disable submit if there's an error*/}
                    <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
                </Stack>
            </form>
        </RenderComponent>
    );
};

export default RainbowCrack;

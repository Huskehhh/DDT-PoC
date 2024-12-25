import { Button, NativeSelect, NumberInput, Stack, TextInput, Grid } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useState, useEffect } from "react";
import { CommandHelper } from "../../utils/CommandHelper";
import ConsoleWrapper from "../ConsoleWrapper/ConsoleWrapper";
import { SaveOutputToTextFile_v2 } from "../SaveOutputToFile/SaveOutputToTextFile";
import { LoadingOverlayAndCancelButton } from "../OverlayAndCancelButton/OverlayAndCancelButton";
import { RenderComponent } from "../UserGuide/UserGuide";
import { checkAllCommandsAvailability } from "../../utils/CommandAvailability";
import InstallationModal from "../InstallationModal/InstallationModal";
import { FilePicker } from "../FileHandler/FilePicker";

/**
 * Represents the form values for the Hydra component.
 */
interface FormValuesType {
    loginInputType: string;
    loginArgs: string;
    passwordInputType: string;
    passwordArgs: string;
    threads: string;
    service: string;
    serviceArgs: string;
    nsr: string;
    config: string;
    optionalConfig: string;
}

//Deals with the generatedfilepath unique identifier that is added at the end of a file
const cleanFileName = (filePath: string): string => {
    // Split the file name by the underscore (_) and keep the first part (before the timestamp/ID)
    const parts = filePath.split("_");

    // Keep only the base file name (before the timestamp and unique identifier)
    const baseFileName = parts[0];
    return baseFileName;
};

/**
 * The Hydra component.
 * @returns The Hydra component.
 */
const Hydra = () => {
    //Component State Variables.
    const [loading, setLoading] = useState(false); // State variable to indicate loading state.
    const [output, setOutput] = useState(""); // State variable to store the output of the command execution.
    const [pid, setPid] = useState(""); // State variable to store the process ID of the command execution.
    const [selectedPasswordInput, setSelectedPasswordInput] = useState(""); //State variable to store selected password input
    const [selectedLoginInput, setSelectedLoginInput] = useState(""); // State variable to store selected login input
    const [selectedService, setSelectedService] = useState(""); //State variable to store selected service
    const [isCommandAvailable, setIsCommandAvailable] = useState(false); // State variable to check if the command is available.
    const [loadingModal, setLoadingModal] = useState(true); // State variable that indicates if the modal is opened.
    const [opened, setOpened] = useState(!isCommandAvailable); // State variable to indicate loading state of the modal.
    const [allowSave, setAllowSave] = useState(false); // State variable to indicate if saving is allowed
    const [hasSaved, setHasSaved] = useState(false); // State variable to indicate if the output has been saved
    const [fileNames, setFileNames] = useState<string[]>([]); // State variable to store the file names.

    // Component Constants.
    const title = "Hydra"; // Title of the component.
    const description =
        "Hydra is a parallelized login cracker which supports numerous protocols to attack. It is very fast and flexible, and new modules are easy to add."; // Description of the component.
    const steps =
        "Step 1: Select the Login settings\n" +
        "Step 2: Specify the Username for the Login\n" +
        "Step 3: Select the Password setting\n" +
        "Step 4: Input password for the Login\n" +
        "Step 5: Select the number of Threads and Service Type\n" +
        "Step 6: Enter an IP address and Port number.\n" +
        "Step 7: Click Crack to commence Hydra's operation.\n" +
        "Step 8: View the Output block below to view the results"; //Steps to run the component
    const sourceLink = "https://www.kali.org/tools/hydra/"; // Link to the source code (or Kali Tools).
    const tutorial = "https://docs.google.com/document/d/14h62IT7RE86O0-15vUZekNV5IaIWcFy6deNageIJ9J0/edit?usp=sharing"; // Link to the official documentation/tutorial.
    const dependencies = ["hydra"]; // Contains the dependencies required by the component.
    const passwordInputTypes = ["Single Password", "File", "Character Set", "Basic", "No Password"]; //Contain options for password input types
    const loginInputTypes = ["Single Login", "File", "No Username"]; // Contain options for login input types
    const serviceType = [
        "FTP",
        "FTPS",
        "HTTP-Get",
        "HTTP-Get-Form",
        "HTTP-Head",
        "HTTP-Post-Form",
        "HTTPS-Get",
        "HTTPS-Get-Form",
        "HTTPS-Head",
        "HTTPS-Post-Form",
        "RDP",
        "RSH",
        "SMB",
        "SMTP",
        "SNMP",
        "SOCKS5",
        "SSH",
        "Telnet",
    ]; //Contain options for service type
    const serviceTypeRequiringConfig = [
        "HTTP-Head",
        "HTTP-Get",
        "HTTP-Get-Form",
        "HTTP-Post-Form",
        "HTTP-Head",
        "HTTPS-Get",
        "HTTPS-Get-Form",
        "HTTPS-Post-Form",
        "Telnet",
    ]; // Contain list of service types that require configuration
    const isLoginSingle = selectedLoginInput === "Single Login"; //Set isLoginSingle to true when single login is selected
    const isLoginFile = selectedLoginInput === "File"; //Set isLoginFile to true when file is selected
    const isPasswordSingle = selectedPasswordInput === "Single Password"; //Set isPasswordSignle to true when single password is selected
    const isPasswordFile = selectedPasswordInput === "File"; //Set isPasswordFile to true when file is selected
    const isPasswordSet = selectedPasswordInput === "Character Set"; // Set isPasswordSet to true when character set is selected
    const isPasswordBasic = selectedPasswordInput === "Basic"; //Set isPasswordBasic to true when basic is selected

    // Form hook to handle form input.
    let form = useForm({
        initialValues: {
            loginInputType: "",
            loginArgs: "",
            passwordInputType: "",
            passwordArgs: "",
            threads: "6",
            service: "",
            serviceArgs: "",
            nsr: "nsr",
            config: "",
            optionalConfig: "",
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

            // Clear the child process pid reference. There is no longer a valid process running.
            setPid("");

            // Cancel the loading overlay. The process has completed.
            setLoading(false);

            // Allow Saving as the output is finalised
            setAllowSave(true);
            setHasSaved(false);
        },
        [handleProcessData]
    );

    /**
     * handleSaveComplete: handle state changes when saves are completed
     * Once the output is saved, prevent duplicate saves
     */
    const handleSaveComplete = () => {
        //Disallow saving once the output is saved
        setHasSaved(true);
        setAllowSave(false);
    };

    /**
     * onSubmit: Asynchronous handler for the form submission event.
     * It sets up and triggers the goldeneye tool with the given parameters.
     * Once the command is executed, the results or errors are displayed in the output.
     *
     * @param {FormValuesType} values - The form values, containing the loginInputType, loginArgs, passwordInputType, passwordArgs, threads, service, serviceArgs, nsr, config, optionalconfig
     */
    const onSubmit = async (values: FormValuesType) => {
        // Activate loading state to indicate ongoing process
        setLoading(true);

        // Disallow saving until the tool's execution is complete
        setAllowSave(false);

        const baseFilePath = "/home/kali";

        // Construct arguments for the  Hydra command based on form input
        const args = [];
        if (selectedLoginInput === "Single Login") {
            args.push(`-l`, `${values.loginArgs}`);
        } else if (selectedLoginInput === "File") {
            const fileToSend = fileNames[0]; // Take the first file from the file picker
            const cleanName = cleanFileName(fileToSend); // Clean the file name (strip unique identifier)
            const dataUploadPath = `${baseFilePath}/${cleanName}`;
            args.push("-l", dataUploadPath);
        }
        if (selectedPasswordInput === "Single Password") {
            args.push(`-p`, `${values.passwordArgs}`);
        } else if (selectedPasswordInput === "File") {
            const fileToSend = fileNames[0]; // Take the first file for passwords
            const cleanName = cleanFileName(fileToSend);
            const dataUploadPath = `${baseFilePath}/${cleanName}`;
            args.push("-P", dataUploadPath);
        } else if (selectedPasswordInput === "Character Set") {
            args.push(`-x`, `${values.passwordArgs}`);
        } else if (selectedPasswordInput === "Basic") {
            args.push(`-e`, `${values.nsr}`);
        }
        if (values.threads) {
            args.push(`-t ${values.threads}`);
        }
        if (serviceTypeRequiringConfig.includes(selectedService)) {
            args.push(`${values.serviceArgs}`, `${values.service.toLowerCase()}`, `${values.config}`);
        } else {
            args.push(`${values.service.toLowerCase()}://${values.serviceArgs}`);
        }
        if (values.optionalConfig.length != 0) {
            args.push(`${values.optionalConfig}`);
        }

        try {
            // Execute the Hydra command via helper method and handle its output or potential errors
            const result = await CommandHelper.runCommandGetPidAndOutput(
                "hydra",
                args,
                handleProcessData,
                handleProcessTermination
            );
            // Update the UI with the results from the executed command
            setPid(result.pid);
            setOutput(result.output);
            console.log(pid);
        } catch (e: any) {
            // Display any errors encountered during command execution
            setOutput(e.message);
            // Deactivate loading state
            setLoading(false);
            setAllowSave(true);
        }
    };

    /**
     * Clears the output state.
     */
    const clearOutput = useCallback(() => {
        setOutput("");

        //Disallow saving when output is cleared
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
            <form
                onSubmit={form.onSubmit((values) =>
                    onSubmit({
                        ...values,
                        passwordInputType: selectedPasswordInput,
                        loginInputType: selectedLoginInput,
                        service: selectedService,
                    })
                )}
            >
                <Stack>
                    {LoadingOverlayAndCancelButton(loading, pid)}
                    <Grid>
                        <Grid.Col span={12}>
                            <NativeSelect
                                value={selectedLoginInput}
                                onChange={(e) => setSelectedLoginInput(e.target.value)}
                                label={"Login settings"}
                                data={loginInputTypes}
                                required
                                placeholder={"Select a setting"}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            {isLoginSingle && (
                                <TextInput
                                    {...form.getInputProps("loginArgs")}
                                    label={"Specify username"}
                                    placeholder={"eg: kali"}
                                    required
                                />
                            )}
                            {isLoginFile && (
                                <FilePicker
                                    fileNames={fileNames}
                                    setFileNames={setFileNames}
                                    multiple={false}
                                    componentName="Hydra"
                                    labelText="Login File (Can only select files in /home/kali)"
                                    placeholderText="Click to select file(s)"
                                />
                            )}
                        </Grid.Col>
                    </Grid>
                    <Grid>
                        <Grid.Col span={12}>
                            <NativeSelect
                                value={selectedPasswordInput}
                                onChange={(e) => setSelectedPasswordInput(e.target.value)}
                                label={"Password settings"}
                                data={passwordInputTypes}
                                placeholder={"Select a setting"}
                                required
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            {isPasswordSingle && (
                                <TextInput
                                    {...form.getInputProps("passwordArgs")}
                                    label={"Password"}
                                    placeholder={"eg: root"}
                                    required
                                />
                            )}
                            {isPasswordFile && (
                                <FilePicker
                                    fileNames={fileNames}
                                    setFileNames={setFileNames}
                                    multiple={false}
                                    componentName="Hydra"
                                    labelText="Password File (Can only select files in /home/kali)"
                                    placeholderText="Click to select file(s)"
                                />
                            )}
                            {isPasswordBasic && (
                                <TextInput label={"Null, username, reverse username"} disabled placeholder={"nsr"} />
                            )}
                        </Grid.Col>
                    </Grid>
                    <Grid>
                        <Grid.Col span={6}>
                            <NumberInput
                                label={"Threads"}
                                {...form.getInputProps("threads")}
                                defaultValue={6}
                                required
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <NativeSelect
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                label={"Service Type"}
                                data={serviceType}
                                required
                                placeholder={"Select a service"}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            {serviceTypeRequiringConfig.includes(selectedService) && (
                                <>
                                    <TextInput
                                        label={"Custom Configuration"}
                                        required
                                        {...form.getInputProps("config")}
                                    />
                                </>
                            )}
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <TextInput
                                {...form.getInputProps("serviceArgs")}
                                label={"IP address"}
                                placeholder={"eg: 192.168.1.1"}
                                required
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <TextInput
                                {...form.getInputProps("optionalConfig")}
                                label={"Optional Configuration"}
                                placeholder={"Please input your optional parameters"}
                            />
                        </Grid.Col>
                    </Grid>

                    <Button type={"submit"} color="cyan">
                        Crack
                    </Button>
                    {SaveOutputToTextFile_v2(output, allowSave, hasSaved, handleSaveComplete)}
                    <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
                </Stack>
            </form>
        </RenderComponent>
    );
};

export default Hydra;

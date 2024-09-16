import { Button, NativeSelect, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useCallback } from "react";
import { CommandHelper } from "../../utils/CommandHelper";
import ConsoleWrapper from "../ConsoleWrapper/ConsoleWrapper";
import { SaveOutputToTextFile_v2 } from "../SaveOutputToFile/SaveOutputToTextFile";
import { RenderComponent } from "../UserGuide/UserGuide";
import { LoadingOverlayAndCancelButton } from "../OverlayAndCancelButton/OverlayAndCancelButton";

//Variables
interface FormValuesType {
    tsharkOptions: string;
    interface: string;
    filePath: string;
    sniffDuration: string;
    trafficFilter: string;
    packetCount: string;
    analysisType?: string;
}

//TShark Options
const tsharkOptions = ["Sniffer", "Reader", "Analyzer"];

const TShark = () => {
    const [output, setOutput] = useState("");
    const [selectedTSharkOption, setSelectedTSharkOption] = useState("");
    const [allowSave, setAllowSave] = useState(false); // State variable to allow saving of output
    const [hasSaved, setHasSaved] = useState(false); // State variable to indicate if output has been saved
    const [loading, setLoading] = useState(false); // State variable to indicate loading state
    const [pid, setPid] = useState("");

    // The following component constants are used for rendering the TShark user guide.
    const title = "TShark";
    const description =
        "TShark is a tool used to capture network traffic and write it to a capture file. The captured traffic can be viewed directly by opening the file, otherwise the Reader option can be used to output the file contents to the output box. The Analyzer option provides traffic analysis options extracting protocol statistics, TCP conversations, and HTTP request data."; // Description of the component.
    const steps =
        "Step 01: Select Sniffer mode.\n" +
        "Step 02: Specify the interface to capture traffic from such as eth0.\n" +
        "Step 03: Specify the output file path (should end with a pcap file).\n" +
        "Step 04: Input the amount of seconds that TShark should capture traffic for (optional).\n" +
        "Step 05: Input a packet count to determine the total number of packets to scan before stopping (optional).\n" +
        "Step 06: Input a traffic filter to filter for specific traffic such as TCP (optional).\n" +
        "Step 07: Click start TShark to sniff traffic.\n" +
        "Step 08: Switch to Reader mode.\n" +
        "Step 09: Provide the file path for the capture file and click start TShark.\n" +
        "Step 10: Switch to Analyzer mode.\n" +
        "Step 11: Provide the file path for the capture file.\n" +
        "Step 12: Seletc the Analyzer type and click start TShark";

    const sourceLink = ""; // Link to the source code (or Kali Tools).
    const tutorial = ""; // Link to the official documentation/tutorial.

    let form = useForm({
        initialValues: {
            interface: "",
            filePath: "",
            sniffDuration: "",
            trafficFilter: "",
            packetCount: "",
            analysisType: "",
        },
        /* validate: {
            filePath: (value) => (selectedTSharkOption === "Analyzer" && !value ? 'PCAP file path is required' : null),
            analysisType: (value) => (selectedTSharkOption === "Analyzer" && !value ? 'Analysis type is required' : null),
        },*/
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
        },
        [handleProcessData] // Dependency on the handleProcessData callback
    );
    /**
     * onSubmit: Asynchronous handler for the form submission event.
     * It sets up and triggers the tshark tool with the given parameters.
     * Once the command is executed, the results or errors are displayed in the output.
     *
     * @param {FormValuesType} values - The form values, containing the <list the form values here, e.g.  interface, packet count, etc>.
     */
    const onSubmit = async (values: FormValuesType) => {
        console.log("Form submitted with values: ", values);
        // Set loading state to true and disallow output saving
        setLoading(true);
        setAllowSave(false);

        let args = [``]; // Using let as this args parameter needs to hold different values throughout the code via "args.push()".

        //duration set to 60 as defualt if Sniff Duration field is empty
        const duration = values.sniffDuration == "" ? " -a duration:60" : ` -a duration:${values.sniffDuration}`;
        //traffic filter set to nothing as default
        const filter = values.trafficFilter == "" ? "" : ` -f ${values.trafficFilter}`;
        //packet count set to nothing as default
        const count = values.packetCount == "" ? "" : ` -c ${values.packetCount}`;

        //Switch case
        switch (values.tsharkOptions) {
            case "Sniffer": //Sniffs for packets and outputs it to a capture file, duration set to 60 as default, filter and count set to nothing as default
                let command = `tshark -i ${values.interface} -w ${values.filePath}${duration}${filter}${count}`;

                CommandHelper.runCommandGetPidAndOutput(
                    "bash", // The command is executed through bash to facilitate correct command syntax (TShark does not require bash to run)
                    ["-c", command],
                    handleProcessData,
                    handleProcessTermination
                )
                    .then(({ output, pid }) => {
                        // Update the UI with the results from the executed command
                        setOutput(output);
                        console.log(pid);
                        setPid(pid);
                    })
                    .catch((error) => {
                        // Display any errors encountered during command execution
                        setOutput(error.message);
                        // Deactivate loading state
                        setLoading(false);
                    })
                    .finally(() => {
                        // Set loading state to false and allow output saving
                        setLoading(false);
                        setAllowSave(true);
                    });
                break;

            case "Reader": //The Reader function reads the traffic from the sniffers output file and displays it in the output box
                args = [`-r`];
                args.push(values.filePath);

                try {
                    let output = await CommandHelper.runCommand("tshark", args);
                    setOutput(output);
                } catch (e: any) {
                    setOutput(e);
                } finally {
                    // Set loading state to false and allow output saving
                    setLoading(false);
                    setAllowSave(true);
                }
                break;

            case "Analyzer": // Analyzes the pcap file for the selected traffic analysis
                //let analysisCommand = `tshark -r ${values.filePath} -q -z io,stat,1`;
                let analysisCommand;
                console.log("Analyzer ", analysisCommand);

                switch (values.analysisType) {
                    case "Protocol Statistics":
                        analysisCommand = `tshark -r ${values.filePath} -q -z io,stat,1`;
                        break;
                    case "TCP Conversations":
                        analysisCommand = `tshark -r ${values.filePath} -q -z conv,tcp`;
                        break;
                    case "HTTP Requests":
                        analysisCommand = `tshark -r ${values.filePath} -Y "http.request" -T fields -e http.host -e http.request.uri`;
                        break;
                    default:
                        setOutput("Invalid analysis type selected.");
                        setLoading(false);
                        return;
                }

                CommandHelper.runCommandGetPidAndOutput(
                    "bash", // The command is executed through bash to facilitate correct command syntax (TShark does not require bash to run)
                    ["-c", analysisCommand],
                    handleProcessData,
                    handleProcessTermination
                )
                    .then(({ output, pid }) => {
                        // Update the UI with the results from the executed command
                        setOutput(output);
                        console.log(pid);
                        setPid(pid);
                    })
                    .catch((error) => {
                        // Display any errors encountered during command execution
                        setOutput(error.message);
                        // Deactivate loading state
                        setLoading(false);
                    })
                    .finally(() => {
                        // Set loading state to false and allow output saving
                        setLoading(false);
                        setAllowSave(true);
                    });
                break;
        }
    };

    /**
     * Handles the completion of output saving by updating state variables.
     */
    const handleSaveComplete = () => {
        setHasSaved(true); // Set hasSaved state to true
        setAllowSave(false); // Disallow further output saving
    };

    /**
     * Clears the command output and resets state variables related to output saving.
     */
    const clearOutput = () => {
        setOutput(""); // Clear the command output
        setHasSaved(false); // Reset hasSaved state
        setAllowSave(false); // Disallow further output saving
    };

    return (
        <RenderComponent
            title={title}
            description={description}
            steps={steps}
            tutorial={tutorial}
            sourceLink={sourceLink}
        >
            <form
                onSubmit={form.onSubmit((values) =>
                    onSubmit({ ...values, tsharkOptions: selectedTSharkOption, analysisType: form.values.analysisType })
                )}
            >
                <Stack>
                    {LoadingOverlayAndCancelButton(loading, pid)}
                    <NativeSelect
                        value={selectedTSharkOption}
                        onChange={(e) => setSelectedTSharkOption(e.target.value)}
                        title={"TShark option"}
                        data={tsharkOptions}
                        required
                        placeholder={"Pick a TShark option"}
                        description={"Type of action to perform"}
                    />
                    {selectedTSharkOption === "Sniffer" && (
                        <>
                            <TextInput
                                label={"Interface"}
                                placeholder="e.g. eth0"
                                required
                                {...form.getInputProps("interface")}
                            />
                            <TextInput
                                label={"File/File Path"}
                                placeholder="e.g. /path/to/destination/capture.pcap"
                                required
                                {...form.getInputProps("filePath")}
                            />
                            <TextInput
                                label={"Sniff Duration (seconds)"}
                                placeholder="e.g. 30"
                                {...form.getInputProps("sniffDuration")}
                            />
                            <TextInput
                                label={"Packet Count"}
                                placeholder="e.g. 10"
                                {...form.getInputProps("packetCount")}
                            />
                            <TextInput
                                label={"Traffic Filter"}
                                placeholder="e.g. tcp"
                                {...form.getInputProps("trafficFilter")}
                            />
                        </>
                    )}
                    {selectedTSharkOption === "Reader" && (
                        <TextInput
                            label={"File/File Path"}
                            placeholder="e.g. /path/to/destination/capture.pcap"
                            required
                            {...form.getInputProps("filePath")}
                        />
                    )}
                    {selectedTSharkOption === "Analyzer" && (
                        <>
                            <TextInput
                                label={"File/File Path"}
                                placeholder="e.g. /path/to/destination/capture.pcap"
                                required
                                {...form.getInputProps("filePath")}
                            />
                            <NativeSelect
                                label="Analysis Type"
                                placeholder="Select analysis"
                                required
                                data={["Protocol Statistics", "TCP Conversations", "HTTP Requests"]}
                                {...form.getInputProps("analysisType")}
                            />
                        </>
                    )}

                    <Button type={"submit"}>Start TShark</Button>
                    {SaveOutputToTextFile_v2(output, allowSave, hasSaved, handleSaveComplete)}
                    <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
                </Stack>
            </form>
        </RenderComponent>
    );
};

export default TShark;

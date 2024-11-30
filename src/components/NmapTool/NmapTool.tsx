// Import necessary hooks and components from React and other libraries
import { useState, useCallback, useEffect } from "react";
import { Stepper, Button, TextInput, Select, Switch, Stack, Grid } from "@mantine/core";
import { useForm } from "@mantine/form";
import { CommandHelper } from "../../utils/CommandHelper";
import ConsoleWrapper from "../ConsoleWrapper/ConsoleWrapper";
import { SaveOutputToTextFile_v2 } from "../SaveOutputToFile/SaveOutputToTextFile";
import { LoadingOverlayAndCancelButton } from "../OverlayAndCancelButton/OverlayAndCancelButton";
import { checkAllCommandsAvailability } from "../../utils/CommandAvailability";
import InstallationModal from "../InstallationModal/InstallationModal";
import { RenderComponent } from "../UserGuide/UserGuide";

/**
 * Represents the form values for the Nmap component.
 */
interface FormValuesType {
    target: string;
    ports: string;
    scanType: string;
    timing: string;
    osDetection: boolean;
    versionDetection: boolean;
    scriptScan: string;
    aggressive: boolean;
    verbose: boolean;
    noPortScan: boolean;
    ipv6: boolean;
    exclusion: string;
}

/**
 * The Nmap component.
 * @returns The Nmap component.
 */
function Nmap() {
    // Declare state variables for component
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState("");
    const [pid, setPid] = useState("");
    const [allowSave, setAllowSave] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);
    const [active, setActive] = useState(0);
    const [isCommandAvailable, setIsCommandAvailable] = useState(false);
    const [opened, setOpened] = useState(!isCommandAvailable);
    const [loadingModal, setLoadingModal] = useState(true);

    // Additional state variables for section visibility
    const [basicOpened, setBasicOpened] = useState(true);
    const [advancedOpened, setAdvancedOpened] = useState(false);

    // Declare constants for the component
    const title = "Nmap";
    const description =
        "Nmap is a powerful network scanning and discovery tool used to explore networks, detect open ports, identify services, and gather information about target systems.";
    const steps =
        "Step 1: Enter the target IP or hostname.\n" +
        "Step 2: Configure scan options.\n" +
        "Step 3: Run the Nmap scan and review results.";
    const sourceLink = "https://nmap.org/book/man.html";
    const tutorial = "";
    const dependencies = ["nmap"];

    // Initialize the form hook with initial values
    const form = useForm<FormValuesType>({
        initialValues: {
            target: "",
            ports: "",
            scanType: "sT",
            timing: "T3",
            osDetection: false,
            versionDetection: false,
            scriptScan: "",
            aggressive: false,
            verbose: false,
            noPortScan: false,
            ipv6: false,
            exclusion: "",
        },
    });

    // Check the availability of commands in the dependencies array
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
     * handleProcessData: Callback to handle and append new data from the child process to the output.
     * It updates the state by appending the new data received to the existing output.
     * @param {string} data - The data received from the child process.
     */
    const handleProcessData = useCallback((data: string) => {
        setOutput((prevOutput) => prevOutput + "\n" + data);
    }, []);

    /**
     * handleProcessTermination: Callback to handle the termination of the child process.
     * Once the process termination is handled, it deactivates the loading overlay.
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
            setLoading(false);
            setAllowSave(true);
            setHasSaved(false);
        },
        [handleProcessData]
    );

    /**
     * handleSaveComplete: Recognises that the output file has been saved.
     * Passes the saved status back to SaveOutputToTextFile_v2
     */
    const handleSaveComplete = () => {
        setHasSaved(true);
        setAllowSave(false);
    };

    /**
     * onSubmit: Asynchronous handler for the form submission event.
     * It sets up and triggers the Nmap tool with the given parameters.
     * Once the command is executed, the results or errors are displayed in the output.
     */
    const onSubmit = async (values: FormValuesType) => {
        setLoading(true);
        setAllowSave(false);

        const args: string[] = [];

        if (values.ports) args.push(`-p ${values.ports}`);
        args.push(`-${values.scanType}`);
        args.push(`-${values.timing}`);
        if (values.osDetection) args.push("-O");
        if (values.versionDetection) args.push("-sV");
        if (values.scriptScan) args.push(`--script=${values.scriptScan}`);
        if (values.aggressive) args.push("-A");
        if (values.verbose) args.push("-v");
        if (values.noPortScan) args.push("-sn");

        args.push(values.target);

        try {
            const { pid, output } = await CommandHelper.runCommandGetPidAndOutput(
                "nmap",
                args,
                handleProcessData,
                handleProcessTermination
            );
            setPid(pid);
            setOutput(output);
        } catch (error: any) {
            setOutput(`Error: ${error.message}`);
            setLoading(false);
            setAllowSave(true);
        }

        // Check if verbose mode is selected
        if (values.verbose) {
        args.push("-v");
}

// Handle scan options
    switch (values.scanType) {
    case "Default":
        // No additional arguments for default scan
        break;
    case "Operating System":
        args.push("-O");
        break;
    case "Firewall Status":
        args.push("-sA");
        break;
    case "Services":
        args.push("-sV");
        break;
    case "Stealth":
        args.push("-sN");
        break;
    case "Device Discovery":
        args.push("-sn");
        break;
    case "Aggressive":
        args.push("-A");
        break;
    case "Top ports":
        args.push("--top-ports", `${values.noPortScan}`);
        break;
    default:
        console.warn("Invalid scan option selected.");
        break;
    }

// Add IPv6 support if enabled
        if (values.ipv6) {
        args.push("-6");
    }

// Add the target IP addresses
        args.push(...values.target);

// Handle exclusions
        if (values.exclusion) {
        args.push("--exclude", ...values.exclusion.split(" "));
}

// Execute the nmap command
CommandHelper.runCommandGetPidAndOutput("nmap", args, handleProcessData, handleProcessTermination)
    .then(({ pid, output }) => {
        setPid(pid);
        setOutput(output);
    })
    .catch((error) => {
        setLoading(false);
        setOutput(`Error: ${error.message}`);
    });


    };

    /**
     * clearOutput: Callback function to clear the console output.
     * It resets the state variable holding the output, thereby clearing the display.
     */
    const clearOutput = useCallback(() => {
        setOutput(" ");
        setHasSaved(false);
        setAllowSave(false);
    }, []);

    // Function to handle the next step in the Stepper.
    const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));

    // Function to handle the previous step in the Stepper.
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    return (
        <>
            {/* Render the component with its title, description, steps, and tutorial */}
            <RenderComponent
                title={title}
                description={description}
                steps={steps}
                tutorial={tutorial}
                sourceLink={sourceLink}
            >
                {/* Render the installation modal if commands are not available */}
                {!loadingModal && (
                    <InstallationModal
                        isOpen={opened}
                        setOpened={setOpened}
                        feature_description={description}
                        dependencies={dependencies}
                    ></InstallationModal>
                )}
                <form onSubmit={form.onSubmit(onSubmit)}>
                    {/* Render the loading overlay and cancel button */}
                    {LoadingOverlayAndCancelButton(loading, pid)}
                    <Stack>
                        {/* Render the Stepper component with steps */}
                        <Stepper active={active} onStepClick={setActive} breakpoint="sm">
                            {/* Step 1: Target */}
                            <Stepper.Step label="Target">
                                <TextInput label="Target IP or Hostname" required {...form.getInputProps("target")} />
                            </Stepper.Step>
                            {/* Step 2: Scan Options */}
                            <Stepper.Step label="Scan Options">
                                <Grid>
                                    <Grid.Col span={6}>
                                        <Button
                                            onClick={() => setBasicOpened(!basicOpened)}
                                            variant="outline"
                                            fullWidth
                                        >
                                            {basicOpened ? "Hide Basic Options" : "Show Basic Options"}
                                        </Button>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Button
                                            onClick={() => setAdvancedOpened(!advancedOpened)}
                                            variant="outline"
                                            fullWidth
                                        >
                                            {advancedOpened ? "Hide Advanced Options" : "Show Advanced Options"}
                                        </Button>
                                    </Grid.Col>
                                </Grid>

                                {/* Render Basic Options */}
                                {basicOpened && (
                                    <Stack mt={10}>
                                        <TextInput
                                            label="Ports"
                                            placeholder="e.g., 80,443,8080 or 1-1000"
                                            {...form.getInputProps("ports")}
                                        />
                                        <Select
                                            label="Scan Type"
                                            data={[
                                                { value: "sT", label: "TCP Connect Scan" },
                                                { value: "sU", label: "UDP Scan" },
                                                { value: "sA", label: "ACK Scan" },
                                            ]}
                                            {...form.getInputProps("scanType")}
                                        />
                                        <Select
                                            label="Timing Template"
                                            data={[
                                                { value: "T0", label: "Paranoid" },
                                                { value: "T1", label: "Sneaky" },
                                                { value: "T2", label: "Polite" },
                                                { value: "T3", label: "Normal" },
                                                { value: "T4", label: "Aggressive" },
                                                { value: "T5", label: "Insane" },
                                            ]}
                                            {...form.getInputProps("timing")}
                                        />
                                    </Stack>
                                )}

                                {/* Render Advanced Options */}
                                {advancedOpened && (
                                    <Stack mt={10}>
                                        <Switch
                                            label="OS Detection"
                                            {...form.getInputProps("osDetection", { type: "checkbox" })}
                                        />
                                        <Switch
                                            label="Version Detection"
                                            {...form.getInputProps("versionDetection", { type: "checkbox" })}
                                        />
                                        <TextInput
                                            label="Script Scan"
                                            placeholder="e.g., default,safe,vuln"
                                            {...form.getInputProps("scriptScan")}
                                        />
                                        <Switch
                                            label="Aggressive Scan"
                                            {...form.getInputProps("aggressive", { type: "checkbox" })}
                                        />
                                        <Switch
                                            label="Verbose Output"
                                            {...form.getInputProps("verbose", { type: "checkbox" })}
                                        />
                                        <Switch
                                            label="No Port Scan (Host Discovery)"
                                            {...form.getInputProps("noPortScan", { type: "checkbox" })}
                                        />
                                    </Stack>
                                )}
                            </Stepper.Step>
                            {/* Step 3: Run */}
                            <Stepper.Step label="Run">
                                <Stack align="center" mt={20}>
                                    <Button type="submit" disabled={loading} style={{ alignSelf: "center" }}>
                                        Run Nmap
                                    </Button>
                                </Stack>
                            </Stepper.Step>
                        </Stepper>
                        {/* Render the SaveOutputToTextFile component */}
                        {SaveOutputToTextFile_v2(output, allowSave, hasSaved, handleSaveComplete)}
                        {/* Render the ConsoleWrapper component */}
                        <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
                    </Stack>
                </form>
            </RenderComponent>
        </>
    );
}

export default Nmap;

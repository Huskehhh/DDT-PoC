import { useState, useEffect, useCallback } from "react";
import { Button, Stack, TextInput, Radio } from "@mantine/core";
import { useForm } from "@mantine/form";
import ConsoleWrapper from "../ConsoleWrapper/ConsoleWrapper";
import { RenderComponent } from "../UserGuide/UserGuide";
import { LoadingOverlayAndCancelButton } from "../OverlayAndCancelButton/OverlayAndCancelButton";
import { checkAllCommandsAvailability } from "../../utils/CommandAvailability";
import InstallationModal from "../InstallationModal/InstallationModal";
import { CommandHelper } from "../../utils/CommandHelper";
import { SaveOutputToTextFile_v2 } from "../SaveOutputToFile/SaveOutputToTextFile";

// Validation Patterns Constant
const VALIDATION_PATTERNS = {
    IPv4: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    IPv6: /^(([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}|(([0-9a-fA-F]{1,4}:){0,6}:([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4})|::)$/
};

interface FormValuesType {
    ipAddress: string;
    ipType: "IPv4" | "IPv6";
}

interface CommandResult {
    pid: string;
}

const ArpanameTool = () => {
    const title = "Arpaname";
    const description = "Perform reverse DNS lookups for IP addresses.";
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState("");
    const [pidTarget, setPidTarget] = useState("");
    const [isCommandAvailable, setIsCommandAvailable] = useState(false);
    const [opened, setOpened] = useState(!isCommandAvailable);
    const [loadingModal, setLoadingModal] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [allowSave, setAllowSave] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);

    const steps =
        "Step 1: Type in the target IP address\n" +
        "Step 2: Click lookup to run Arpaname.\n" +
        "Step 3: View the output block to see the results. ";
    const sourceLink = "https://www.kali.org/tools/bind9/#arpaname";
    const tutorial = "https://docs.google.com/document/d/1dwLjkG_kFi2shSGeDVQByz64j-93ghUAElsPE9T3YLU/edit?usp=sharing";
    const dependencies = ["arpaname"];

    // Validate IP Address
    const validateIPAddress = (ip: string, type: "IPv4" | "IPv6") => 
        VALIDATION_PATTERNS[type].test(ip);

    // Check command availability on mount
    useEffect(() => {
        const checkAvailability = async () => {
            try {
                const isAvailable = await checkAllCommandsAvailability(dependencies);
                setIsCommandAvailable(isAvailable);
                setOpened(!isAvailable);
            } catch (error) {
                console.error("An error occurred:", error);
                setIsCommandAvailable(false);
                setOpened(true);
            } finally {
                setLoadingModal(false);
            }
        };

        checkAvailability();
    }, []);

    const form = useForm<FormValuesType>({
        initialValues: {
            ipAddress: "",
            ipType: "IPv4",
        },
    });

    // Handle process data
    const handleProcessData = useCallback((data: string) => {
        setOutput((prevOutput) => prevOutput + "\n" + data);
    }, []);

    // Handle process termination
    const handleProcessTermination = useCallback(
        ({ code, signal }: { code?: number; signal?: number }) => {
            if (code === 0) {
                handleProcessData("\nProcess completed successfully.");
            } else if (signal === 15) {
                handleProcessData("\nProcess was manually terminated.");
            } else if (code !== undefined) {
                handleProcessData(`\nProcess terminated with exit code: ${code} and signal code: ${signal}`);
            }
            setLoading(false);
            setAllowSave(true);
            setHasSaved(false);
        },
        [handleProcessData]
    );

    // Handle save completion
    const handleSaveComplete = () => {
        setHasSaved(true);
        setAllowSave(false);
    };

    // Clear output
    const clearOutput = useCallback(() => {
        setOutput("");
        setHasSaved(false);
        setAllowSave(false);
    }, []);

    // Submit handler
    const onSubmit = async (values: FormValuesType) => {
        if (!validateIPAddress(values.ipAddress, values.ipType)) {
            setErrorMessage(`Please enter a valid ${values.ipType} address.`);
            return;
        }

        setAllowSave(false);
        setErrorMessage("");
        setLoading(true);

        const argsIP = [values.ipAddress];

        try {
            const result_target: CommandResult = await CommandHelper.runCommandGetPidAndOutput(
                "arpaname",
                argsIP,
                handleProcessData,
                handleProcessTermination
            );
            setPidTarget(result_target.pid ?? "");
        } catch (error) {
            handleProcessData(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
            setLoading(false);
        }
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
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
                <Stack>
                    {LoadingOverlayAndCancelButton(loading, pidTarget)}
                    <TextInput 
                        label="IP address" 
                        required 
                        {...form.getInputProps("ipAddress")} 
                    />
                    {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
                    <Radio.Group
                        value={form.values.ipType}
                        onChange={(value: "IPv4" | "IPv6") => form.setFieldValue("ipType", value)}
                        label="Select IP Type"
                        required
                    >
                        <Radio value="IPv4" label="IPv4" />
                        <Radio value="IPv6" label="IPv6" />
                    </Radio.Group>
                    <Button type="submit">Lookup</Button>
                    {SaveOutputToTextFile_v2(output, allowSave, hasSaved, handleSaveComplete)}
                    <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
                </Stack>
            </form>
        </RenderComponent>
    );
};

export default ArpanameTool;
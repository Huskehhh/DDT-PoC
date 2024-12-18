import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useState, useEffect } from "react";
import { CommandHelper } from "../../utils/CommandHelper";
import ConsoleWrapper from "../ConsoleWrapper/ConsoleWrapper";
import { RenderComponent } from "../UserGuide/UserGuide";
import { SaveOutputToTextFile_v2 } from "../SaveOutputToFile/SaveOutputToTextFile";
import { LoadingOverlayAndCancelButton } from "../OverlayAndCancelButton/OverlayAndCancelButton";
import InstallationModal from "../InstallationModal/InstallationModal";
import { checkAllCommandsAvailability } from "../../utils/CommandAvailability";

/**
 * Represents the form values for the ZeroLogon component.
 */
interface FormValues {
    dcName: string;
    targetIP: string;
    adminName: string;
    hashes: string;
}

/**
 * The ZeroLogon component.
 * @returns The ZeroLogon component.
 */
const ZeroLogon = () => {
    // Component State Variables.
    const [loading, setLoading] = useState(false); // State variable to indicate loading state.
    const [output, setOutput] = useState(""); // State variable to store the output of the command execution.
    const [pid, setPid] = useState(""); // State variable to store the process ID of the command execution.
    const [allowSave, setAllowSave] = useState(false); // State variable to allow saving the output.
    const [hasSaved, setHasSaved] = useState(false); // State variable to indicate if the output has been saved.
    const [opened, setOpened] = useState(true); // State variable to indicate if the modal is opened.
    const [loadingModal, setLoadingModal] = useState(true); // State variable to indicate loading state of the modal.

    // Component Constants.
    const title = "ZeroLogon"; // Title of the component.
    const description =
        "The ZeroLogon CVE allows an attacker that has unauthenticated access to a domain controller within their network " +
        "access to create a Netlogon session that can be exploited to grant domain administrative privileges. The vulnerability " +
        "here lays within an implementation flaw for AES-CFB8 where a cryptographic transformation takes place with use of a " +
        "session key.\n\nFurther information can be found at: https://www.crowdstrike.com/blog/cve-2020-1472-zerologon-" +
        "security-advisory/\n\n";
    const steps = "Using ZeroLogon:\n\n" +
        "Step 1: Enter a domain controller name.\n" +
        "       Eg: TEST-AD\n\n" +
        "Step 2: Enter a target IP address.\n" +
        "       Eg: 192.168.1.1\n\n" +
        "Step 3: Enter an administrative name @ Domain Controller IP.\n" +
        "       Eg: Administrator\n\n" +
        "Step 4: Enter any relevant hashes.\n" +
        "       Eg: Administrator:500:CEEB0FA9F240C200417EAF40CFAC29C3:D280553F0103F2E643406517296E7582:::\n\n" +
        "Step 5: Click Exploit to commence ZeroLogon’s operation.\n\n" +
        "Step 6: View the Output block below to view the results of the attack vector's execution."; // Steps for using the tool, if applicable.
    const sourceLink =
        "https://www.infosecinstitute.com/resources/vulnerabilities/zerologon-cve-2020-1472-technical-overview-and-walkthrough"; // Link to the source code or relevant documentation.
    const tutorial = "https://docs.google.com/document/d/1D_qHImf9zkRiSnFdBnAuMuiIKotLGst9_y0PR5ozrCs/edit?usp=sharing"; // Link to the official tutorial/documentation.
    const dependencies = ["python3"]; // Dependencies required by the component.

    // Form hook to handle form input.
    const form = useForm<FormValues>({
        initialValues: {
            dcName: "",
            targetIP: "",
            adminName: "",
            hashes: "",
        },
    });

    // Check if the required commands are available and set state accordingly.
    useEffect(() => {
        // Check command availability and set modal state
        checkAllCommandsAvailability(dependencies)
            .then((isAvailable) => {
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
     * @param {string} data - The data received from the child process.
     */
    const handleProcessData = useCallback((data: string) => {
        setOutput((prevOutput) => prevOutput + "\n" + data); // Append new data to the previous output.
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
            setAllowSave(true);
            setHasSaved(false);
        },
        [handleProcessData]
    );

    /**
     * onSubmit: Asynchronous handler for the form submission event.
     * @param {FormValues} values - The form values for the ZeroLogon tool.
     */
    const onSubmit = async (values: FormValues) => {
        setLoading(true);
        setAllowSave(false);

        const args = ["/usr/share/ddt/zerologon_tester.py", values.dcName, values.targetIP];
        const result = await CommandHelper.runCommandGetPidAndOutput(
            "python3",
            args,
            handleProcessData,
            handleProcessTermination
        );

        setPid(result.pid);
        setOutput(result.output);
        setLoading(false);
        setAllowSave(true);
    };

    /**
     * Clears the output state.
     */
    const clearOutput = useCallback(() => {
        setOutput("");
        setHasSaved(false);
        setAllowSave(false);
    }, []);

    /**
     * Handles the completion of saving the output to a text file.
     */
    const handleSaveComplete = useCallback(() => {
        setHasSaved(true);
        setAllowSave(false);
    }, []);

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
                    <TextInput label={"Domain controller (DC) name"} required {...form.getInputProps("dcName")} />
                    <TextInput label={"Target IP"} required {...form.getInputProps("targetIP")} />
                    <TextInput label={"Administrative Name@DC-IP"} required {...form.getInputProps("adminName")} />
                    <TextInput label={"Hashes"} required {...form.getInputProps("hashes")} />

                    <Button type={"submit"}>Exploit</Button>
                    {SaveOutputToTextFile_v2(output, allowSave, hasSaved, handleSaveComplete)}
                    <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
                </Stack>
            </form>
        </RenderComponent>
    );
};

export { ZeroLogon };

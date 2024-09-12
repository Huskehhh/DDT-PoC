import { useState, useEffect, useCallback } from "react";
import { Button, Stack, TextInput, Checkbox } from "@mantine/core";
import { useForm } from "@mantine/form";
import { CommandHelper } from "../../utils/CommandHelper";
import ConsoleWrapper from "../ConsoleWrapper/ConsoleWrapper";
import { SaveOutputToTextFile_v2 } from "../SaveOutputToFile/SaveOutputToTextFile";
import { RenderComponent } from "../UserGuide/UserGuide";
import InstallationModal from "../InstallationModal/InstallationModal";
import { LoadingOverlayAndCancelButton } from "../OverlayAndCancelButton/OverlayAndCancelButton";
import { checkAllCommandsAvailability } from "../../utils/CommandAvailability";

interface FormValuesType {
    filePath: string;
    tag: string;
    value: string;
    actionType: string; // "read" or "write"
}

const ExifTool = () => {
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState("");
    const [allowSave, setAllowSave] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);
    const [isCommandAvailable, setIsCommandAvailable] = useState(false);
    const [opened, setOpened] = useState(!isCommandAvailable);
    const [loadingModal, setLoadingModal] = useState(true);
    const [pid, setPid] = useState("");
    
    const title = "ExifTool";
    const description = "ExifTool is a platform-independent command-line application for reading, writing, and editing metadata in a wide variety of file types.";
    const steps = "";
    const sourceLink = ""; // Link to the source code
    const tutorial = ""; // Link to the official documentation/tutorial
    const dependencies = ["exiftool"]; // ExifTool dependency.

    let form = useForm<FormValuesType>({
        initialValues: {
            filePath: "",
            tag: "",
            value: "",
            actionType: "read",
        },
    });

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

    const handleProcessData = useCallback((data: string) => {
        setOutput((prevOutput) => prevOutput + "\n" + data);
    }, []);

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

    const onSubmit = async (values: FormValuesType) => {
        setLoading(true);
        let args = [values.filePath];

        if (values.actionType === "read") {
            args.push("-" + values.tag);
        } else if (values.actionType === "write") {
            args.push("-" + values.tag + "=" + values.value);
        }
    
        CommandHelper.runCommandWithPkexec("exiftool", args, handleProcessData, handleProcessTermination)
            .then(() => {
                setLoading(false);
            })
            .catch((error) => {
                setOutput(`Error: ${error.message}`);
                setLoading(false);
            });
        setAllowSave(true);
    };

    const handleSaveComplete = () => {
        setHasSaved(true);
        setAllowSave(false);
    };

    const clearOutput = () => {
        setOutput("");
        setHasSaved(false);
        setAllowSave(false);
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
                        label="File Path"
                        required
                        {...form.getInputProps("filePath")}
                        placeholder="e.g. /path/to/file.jpg"
                    />
                    <TextInput
                        label="Metadata Tag"
                        required
                        {...form.getInputProps("tag")}
                        placeholder="e.g. Author"
                    />
                    <TextInput
                        label="Value (for writing)"
                        {...form.getInputProps("value")}
                        placeholder="e.g. John Doe"
                    />
                    <Checkbox
                        label="Read Metadata"
                        checked={form.values.actionType === "read"}
                        onChange={() => form.setFieldValue("actionType", "read")}
                    />
                    <Checkbox
                        label="Write Metadata"
                        checked={form.values.actionType === "write"}
                        onChange={() => form.setFieldValue("actionType", "write")}
                    />
                    <Button type={"submit"}>Run {title}</Button>
                    {SaveOutputToTextFile_v2(output, allowSave, hasSaved, handleSaveComplete)}
                    <ConsoleWrapper output={output} clearOutputCallback={clearOutput} />
                </Stack>
            </form>
        </RenderComponent>
    );
};

export default ExifTool;
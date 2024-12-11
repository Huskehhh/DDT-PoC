import { useState } from "react";
import { Stepper, Button, TextInput, Stack } from "@mantine/core";
import { RenderComponent } from "../UserGuide/UserGuide";

function IPInsightTool() {
    const [active, setActive] = useState(0);
    const [ipAddress, setIpAddress] = useState("");
    const [traceResults, setTraceResults] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    const handleTraceIP = async () => {
        if (!ipAddress.trim()) {
            setError("Please enter a valid IP address.");
            return;
        }
        setError(null);
        setTraceResults(null);
        setLoading(true);

        try {
            const response = await new Promise((resolve) =>
                setTimeout(() => resolve(`Trace results for IP: ${ipAddress}`), 2000)
            );
            setTraceResults(response as string);
        } catch (err) {
            setError("Failed to trace IP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const title = "IP Insight Tool";
    const description = "This tool provides trace, ownership, and geolocation information for a given IP address.";
    const steps = "Step 1: Enter an IP Address.\nStep 2: Run the trace.\nStep 3: Review the results.";

    return (
        <RenderComponent
            title={title}
            description={description}
            steps={steps}
            tutorial="" // Add a tutorial link if available
            sourceLink="" // Add a source link if available
        >
            <Stepper active={active} onStepClick={setActive} breakpoint="sm">
                <Stepper.Step label="Target" description="Enter IP Address">
                    <TextInput
                        label="Target IP or Hostname"
                        placeholder="e.g., 192.168.1.1"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        required
                        error={error}
                    />
                    <Button onClick={nextStep} style={{ marginTop: "10px" }}>
                        Next
                    </Button>
                </Stepper.Step>

                <Stepper.Step label="Trace" description="Run the trace">
                    <Stack>
                        <Button
                            onClick={handleTraceIP}
                            loading={loading}
                            style={{ marginBottom: "10px" }}
                        >
                            Trace IP
                        </Button>
                        {traceResults && (
                            <div style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
                                <strong>Results:</strong>
                                <p>{traceResults}</p>
                            </div>
                        )}
                    </Stack>
                    <Button onClick={prevStep} variant="outline" style={{ marginTop: "10px" }}>
                        Back
                    </Button>
                </Stepper.Step>

                <Stepper.Step label="Review" description="Check the results">
                    <div style={{ textAlign: "center", padding: "20px" }}>
                        <h3>Trace Complete</h3>
                        <p>{traceResults || "No results to display."}</p>
                    </div>
                    <Button onClick={prevStep} variant="outline">
                        Back
                    </Button>
                </Stepper.Step>
            </Stepper>
        </RenderComponent>
    );
}

export default IPInsightTool;

import { Stack, Table, Title, NativeSelect } from "@mantine/core";
import { useState } from "react";
import { getTools } from "../components/RouteWrapper";
import ToolItem from "../components/ToolItem/ToolItem";

const ToolsPage = () => {
    const categories = [
        "All",
        "Attack Tools",
        "File Analysis and Recovery",
        "Information Gathering and Analysis",
        "IOT",
        "Miscellaneous",
        "Network Scanning and Enumeration",
        "Password Cracking and Authentication Testing",
        "Vulnerability Assessment and Exploitation",
        "Web Application Testing",
    ];

    const [selectedCategory, setSelectedCategory] = useState("");
    const tools = getTools();

    return (
        <Stack align={"center"}>
            <Title>Tools</Title>
            <NativeSelect
                value={selectedCategory}
                onChange={(e) => {
                    setSelectedCategory(e.target.value);
                }}
                title="Filter for a Category"
                data={categories}
                required
                placeholder="Filter for a Category"
            />
            <Table horizontalSpacing="xl" verticalSpacing="md" fontSize="md">
                <thead>
                    <tr>
                        <th>Tool name</th>
                        <th>Tool description</th>
                        <th>Category</th>
                    </tr>
                </thead>

                <tbody>
                    {tools.map((tool) => {
                        // Check if the selected category matches the tool's category
                        if (!selectedCategory || selectedCategory === "All" || tool.category === selectedCategory) {
                            return (
                                <ToolItem
                                    title={tool.name}
                                    description={tool.description}
                                    route={tool.path}
                                    category={tool.category}
                                    key={tool.name}
                                />
                            );
                        }
                        return null; // Skip rendering if the category doesn't match
                    })}
                </tbody>
            </Table>
        </Stack>
    );
};

export default ToolsPage;

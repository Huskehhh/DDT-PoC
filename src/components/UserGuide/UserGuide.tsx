import { Title, HoverCard, Text, Tabs } from "@mantine/core";
import { IconAbacus, IconBuildingLighthouse, IconQuestionMark, IconSettings } from "@tabler/icons";
import styles from "./UserGuide.module.css";
import React from "react";

interface ComponentProps {
    title: string; // Title of the component. This should be strictly limited to the title.
    description: string; // Description of the component. This should not include steps.
    steps: string; // Steps to use the component. This should be strictly limited to the steps.
    tutorial: string; // Tutorial for the component.
    sourceLink: string; // Source link for the component.
    children: React.ReactNode; // Children of the component. Used to render the configuration.
}

/**
 * Renders a user guide component with a title and description.
 * @deprecated
 * @param title - The title of the user guide.
 * @param description - The description of the user guide.
 * @returns The rendered user guide component.
 */
export function UserGuide(title: string, description: string) {
    return (
        <Title>
            {title}
            <HoverCard width={900} shadow="md" position="bottom" closeDelay={1000}>
                <HoverCard.Target>
                    <IconQuestionMark size={24} color="red" />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Text className={styles.text} size="md">
                        <pre style={{ whiteSpace: "pre-wrap" }}>{description}</pre>
                    </Text>
                </HoverCard.Dropdown>
            </HoverCard>
        </Title>
    );
}

/**
 * Renders a user guide component with a hover card that displays a description.
 * @deprecated
 * @param description - The description to be displayed in the hover card.
 * @returns The rendered user guide component.
 */
export function UserGuide2(description: string) {
    return (
        <HoverCard width={900} shadow="md" position="bottom" closeDelay={300}>
            <HoverCard.Target>
                <IconQuestionMark size={32} color="red" />
            </HoverCard.Target>
            <HoverCard.Dropdown>
                <Text className={styles.text} size="md">
                    <pre style={{ whiteSpace: "pre-wrap" }}>{description}</pre>
                </Text>
            </HoverCard.Dropdown>
        </HoverCard>
    );
}

/**
 * Renders a component with tabs for user guide, configuration, and tutorial.
 *
 * @param component - The component props.
 * @returns The rendered component.
 */
export function RenderComponent(component: ComponentProps) {
    return (
        <>
            <Title align="center" style={{ paddingBottom: "10px" }}>
                {component.title}
            </Title>

            <Tabs defaultValue="configuration">
                <Tabs.List grow style={{ marginBottom: "10px" }}>
                    <Tabs.Tab value="userGuide" icon={<IconBuildingLighthouse width={16} height={16} />}>
                        User Guide
                    </Tabs.Tab>
                    <Tabs.Tab value="configuration" icon={<IconSettings width={16} height={16} />}>
                        Configuration
                    </Tabs.Tab>
                    <Tabs.Tab value="tutorial" disabled icon={<IconAbacus width={16} height={16} />}>
                        Tutorial
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="userGuide">
                    <Title>What is {component.title}</Title>
                    <Text className={styles.text} size="md">
                        <pre style={{ whiteSpace: "pre-wrap" }}>{component.description}</pre>
                        <pre style={{ whiteSpace: "pre-wrap" }}>{component.steps}</pre>
                    </Text>
                </Tabs.Panel>

                <Tabs.Panel value="configuration">
                    <Title>Configure {component.title}</Title>
                    {component.children}
                </Tabs.Panel>

                <Tabs.Panel value="tutorial">
                    <Text className={styles.text} size="md">
                        <pre style={{ whiteSpace: "pre-wrap" }}>{component.tutorial}</pre>
                        <pre style={{ whiteSpace: "pre-wrap" }}>{component.sourceLink}</pre>
                    </Text>
                </Tabs.Panel>
            </Tabs>
        </>
    );
}
export default UserGuide;

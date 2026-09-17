import type { Meta, StoryObj } from "@storybook/react";
import { Tab, TabList, TabPanel, Tabs } from "../components/Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs seed={42} defaultValue="one">
      <TabList aria-label="Demo">
        <Tab value="one">One</Tab>
        <Tab value="two">Two</Tab>
        <Tab value="three">Three</Tab>
      </TabList>
      <TabPanel value="one">First panel</TabPanel>
      <TabPanel value="two">Second panel</TabPanel>
      <TabPanel value="three">Third panel</TabPanel>
    </Tabs>
  ),
};

export const NoAnimation: Story = {
  render: () => (
    <Tabs seed={42} animate={false} defaultValue="one">
      <TabList>
        <Tab value="one">One</Tab>
        <Tab value="two">Two</Tab>
      </TabList>
      <TabPanel value="one">Static panel</TabPanel>
      <TabPanel value="two">Other</TabPanel>
    </Tabs>
  ),
};

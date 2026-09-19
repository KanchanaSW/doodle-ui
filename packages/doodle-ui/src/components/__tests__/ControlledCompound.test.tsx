import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Checkbox } from "../Checkbox";
import { Switch } from "../Switch";
import { Tabs, TabList, Tab, TabPanel } from "../Tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../Accordion";
import { Combobox } from "../Combobox";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../Table";
import { renderWithProviders } from "../../test/test-utils";

describe("Controlled + uncontrolled", () => {
  it("Checkbox uncontrolled defaultChecked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Checkbox seed={42} animate={false} defaultChecked label="On" />,
    );
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("aria-checked", "true");
    await user.click(box);
    expect(box).toHaveAttribute("aria-checked", "false");
  });

  it("Checkbox controlled checked + onCheckedChange", async () => {
    const user = userEvent.setup();
    function Demo() {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox
          seed={42}
          animate={false}
          label="Ctrl"
          checked={checked}
          onCheckedChange={setChecked}
        />
      );
    }
    renderWithProviders(<Demo />);
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("aria-checked", "false");
    await user.click(box);
    expect(box).toHaveAttribute("aria-checked", "true");
  });

  it("Switch supports both modes", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    renderWithProviders(
      <Switch
        seed={42}
        animate={false}
        label="Sw"
        defaultChecked
        onCheckedChange={onCheckedChange}
      />,
    );
    await user.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("Tabs uncontrolled does not pass dual value props", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderWithProviders(
      <Tabs seed={42} defaultValue="one" onValueChange={onValueChange}>
        <TabList>
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
        </TabList>
        <TabPanel value="one">Panel one</TabPanel>
        <TabPanel value="two">Panel two</TabPanel>
      </Tabs>,
    );
    await user.click(screen.getByRole("tab", { name: "Two" }));
    expect(onValueChange).toHaveBeenCalledWith("two");
  });

  it("Accordion compound statics work", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Accordion seed={42} type="single" collapsible defaultValue="a">
        <Accordion.Item value="a">
          <Accordion.Trigger>Alpha</Accordion.Trigger>
          <Accordion.Content>Alpha body</Accordion.Content>
        </Accordion.Item>
        <AccordionItem value="b">
          <AccordionTrigger>Beta</AccordionTrigger>
          <AccordionContent>Beta body</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    expect(screen.getByText("Alpha body")).toBeVisible();
    await user.click(screen.getByText("Beta"));
    expect(screen.getByText("Beta body")).toBeVisible();
  });

  it("Combobox supports open control", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderWithProviders(
      <Combobox
        seed={42}
        animate={false}
        options={[
          { value: "a", label: "Alpha" },
          { value: "b", label: "Beta" },
        ]}
        defaultOpen={false}
        onOpenChange={onOpenChange}
        aria-label="Pick"
      />,
    );
    await user.click(screen.getByRole("combobox"));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

describe("Table compound", () => {
  it("renders Header/Head/Body/Row/Cell", () => {
    renderWithProviders(
      <Table seed={42} animate={false}>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <TableRow>
            <TableCell>Ada</TableCell>
          </TableRow>
        </Table.Body>
      </Table>,
    );
    expect(screen.getByText("Name").tagName).toBe("TH");
    expect(screen.getByText("Ada").tagName).toBe("TD");
    expect(document.querySelector("thead")).toBeTruthy();
  });

  it("keeps TableHeaderCell alias", () => {
    renderWithProviders(
      <Table seed={42} animate={false}>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Col</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Val</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByText("Col").tagName).toBe("TH");
  });
});

describe("Size variants", () => {
  it("Checkbox sm control is smaller than lg", () => {
    const { unmount } = renderWithProviders(
      <Checkbox seed={42} animate={false} size="sm" label="Sm" />,
    );
    const sm = screen.getByRole("checkbox");
    expect(sm.style.width).toBe("16px");
    unmount();

    renderWithProviders(
      <Checkbox seed={42} animate={false} size="lg" label="Lg" />,
    );
    expect(screen.getByRole("checkbox").style.width).toBe("24px");
  });
});

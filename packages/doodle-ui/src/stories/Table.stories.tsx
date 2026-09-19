import type { Meta, StoryObj } from "@storybook/react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "../components/Table";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  args: { seed: 42, animate: false },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Compound: Story = {
  render: () => (
    <Table seed={42} animate={false}>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Role</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Ada</Table.Cell>
          <Table.Cell>Engineer</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Grace</Table.Cell>
          <Table.Cell>Admiral</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const NamedExports: Story = {
  render: () => (
    <Table seed={43} animate={false}>
      <TableHeader>
        <TableRow>
          <TableHead>Fruit</TableHead>
          <TableHead>Color</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Apple</TableCell>
          <TableCell>Red</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, Controller } from "react-hook-form";
import { createRef } from "react";
import { Input } from "../Input";
import { Textarea } from "../Textarea";
import { Checkbox } from "../Checkbox";
import { Radio, RadioGroup } from "../Radio";
import { Switch } from "../Switch";
import { Select } from "../Select";
import { renderWithProviders } from "../../test/test-utils";

describe("Form integration — refs & native attrs", () => {
  it("Input forwards ref to native input", () => {
    const ref = createRef<HTMLInputElement>();
    renderWithProviders(
      <Input ref={ref} seed={42} animate={false} name="email" />,
    );
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.name).toBe("email");
  });

  it("Textarea forwards ref to native textarea", () => {
    const ref = createRef<HTMLTextAreaElement>();
    renderWithProviders(
      <Textarea ref={ref} seed={42} animate={false} name="bio" required />,
    );
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current?.required).toBe(true);
  });

  it("Input sets aria-invalid and error message via error prop", () => {
    renderWithProviders(
      <Input
        seed={42}
        animate={false}
        label="Email"
        error="Required field"
      />,
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Required field");
    expect(input.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("Checkbox supports name for FormData", async () => {
    const user = userEvent.setup();
    let submitted: FormData | null = null;
    renderWithProviders(
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitted = new FormData(e.currentTarget);
        }}
      >
        <Checkbox
          seed={42}
          animate={false}
          name="terms"
          value="yes"
          label="Accept"
          defaultChecked
        />
        <button type="submit">Go</button>
      </form>,
    );
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(submitted?.get("terms")).toBe("yes");
  });

  it("RadioGroup name works with FormData", async () => {
    const user = userEvent.setup();
    let submitted: FormData | null = null;
    renderWithProviders(
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitted = new FormData(e.currentTarget);
        }}
      >
        <RadioGroup name="plan" defaultValue="pro" aria-label="Plan">
          <Radio seed={42} animate={false} value="free" label="Free" />
          <Radio seed={43} animate={false} value="pro" label="Pro" />
        </RadioGroup>
        <button type="submit">Go</button>
      </form>,
    );
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(submitted?.get("plan")).toBe("pro");
  });
});

describe("react-hook-form register()", () => {
  function RegisterForm() {
    const { register, handleSubmit } = useForm<{ email: string; notes: string }>();
    const onSubmit = vi.fn();
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          seed={42}
          animate={false}
          label="Email"
          {...register("email", { required: true })}
        />
        <Textarea
          seed={43}
          animate={false}
          label="Notes"
          {...register("notes")}
        />
        <button type="submit">Submit</button>
      </form>
    );
  }

  it("registers Input and Textarea", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />);
    await user.type(screen.getByLabelText("Email"), "a@b.com");
    await user.type(screen.getByLabelText("Notes"), "hello");
    await user.click(screen.getByRole("button", { name: "Submit" }));
    // Form submits without throwing — values wired via register
    expect(screen.getByLabelText("Email")).toHaveValue("a@b.com");
    expect(screen.getByLabelText("Notes")).toHaveValue("hello");
  });
});

describe("react-hook-form Controller", () => {
  function ControllerForm() {
    const { control, handleSubmit } = useForm<{
      accept: boolean;
      notify: boolean;
      plan: string;
      fruit: string;
    }>({
      defaultValues: {
        accept: false,
        notify: false,
        plan: "a",
        fruit: "",
      },
    });
    const onSubmit = vi.fn();
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="accept"
          control={control}
          render={({ field }) => (
            <Checkbox
              seed={42}
              animate={false}
              label="Accept"
              checked={field.value}
              onCheckedChange={field.onChange}
              name={field.name}
            />
          )}
        />
        <Controller
          name="notify"
          control={control}
          render={({ field }) => (
            <Switch
              seed={43}
              animate={false}
              label="Notify"
              checked={field.value}
              onCheckedChange={field.onChange}
              name={field.name}
            />
          )}
        />
        <Controller
          name="plan"
          control={control}
          render={({ field }) => (
            <RadioGroup
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              aria-label="Plan"
            >
              <Radio seed={44} animate={false} value="a" label="A" />
              <Radio seed={45} animate={false} value="b" label="B" />
            </RadioGroup>
          )}
        />
        <Controller
          name="fruit"
          control={control}
          render={({ field }) => (
            <Select
              seed={46}
              animate={false}
              name={field.name}
              value={field.value || undefined}
              onValueChange={field.onChange}
              options={[
                { value: "apple", label: "Apple" },
                { value: "banana", label: "Banana" },
              ]}
              aria-label="Fruit"
            />
          )}
        />
        <button type="submit">Submit</button>
      </form>
    );
  }

  it("wires Checkbox Switch Radio Select via Controller", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ControllerForm />);

    await user.click(screen.getByLabelText("Accept"));
    await user.click(screen.getByLabelText("Notify"));
    await user.click(screen.getByLabelText("B"));

    await waitFor(() => {
      expect(screen.getByLabelText("Accept")).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });
    expect(screen.getByLabelText("Notify")).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByLabelText("B")).toHaveAttribute("aria-checked", "true");
  });
});

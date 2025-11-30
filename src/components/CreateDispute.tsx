import * as React from "react";
import { z } from "zod";
import { Flex } from "@radix-ui/themes";
import { FormModal } from "../components/FormModal";
import { FieldText, FieldTextarea, FieldSelect } from "../components/Form";

const schema = z.object({
  description: z.string().min(3, "Please describe the dispute (min 3 chars)."),
  option1: z.string().min(1, "Option #1 is required."),
  option2: z.string().min(1, "Option #2 is required."),

  nivsters: z.preprocess(
    (v) => (typeof v === "string" && v !== "" ? Number(v) : v),
    z
      .number()
      .int()
      .min(1, "Nivsters must be 0 or more.")
      .max(255, "Nivsters must be ≤ 255.")
  ),
  category: z.enum(["general", "fraud", "other"]),
});

export function OpenDisputeModal({
  onSubmit,
  feeRate,
  courtId,
}: {
  onSubmit: (values: z.infer<typeof schema>) => Promise<void> | void;
  feeRate: number;
  courtId: string;
}) {
  const [nivstersLive, setNivstersLive] = React.useState(0);

  const feePreviewSui = (feeRate * (nivstersLive || 0)) / 1_000_000_000;

  return (
    <FormModal
      trigger={
        <button className="btn btn-primary ghostish">Open Dispute</button>
      }
      title="Open a dispute"
      description="Provide details and stake NVR to initiate a dispute."
      size="md"
      schema={schema}
      defaultValues={{
        description: "",
        option1: "",
        option2: "",
        nivsters: 0,
        category: "general",
      }}
      onSubmit={onSubmit}
      submitLabel="Create dispute"
      cancelLabel="Cancel"
      render={() => (
        <Flex direction="column" gap="3">
          <FieldTextarea
            name="description"
            label="Description"
            required
            hint="Explain the situation."
            rows={4}
          />

          <Flex gap="3">
            <FieldText name="option1" label="Option #1" required />
            <FieldText name="option2" label="Option #2" required />
          </Flex>

          <Flex gap="3">
            <FieldText
              name="nivsters"
              label="Nivsters (0–255)"
              required
              type="number"
              inputMode="numeric"
              min={0}
              max={255}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const v = e.target.value;
                const n = v === "" ? 0 : Number(v);
                setNivstersLive(Number.isFinite(n) ? n : 0);
              }}
            />
          </Flex>

          <FieldSelect
            name="category"
            label="Category"
            items={[
              { value: "general", label: "General" },
              { value: "fraud", label: "Fraud" },
              { value: "other", label: "Other" },
            ]}
          />

          <div className="muted small">
            Fee preview:{" "}
            <strong>
              {feePreviewSui.toLocaleString(undefined, {
                maximumFractionDigits: 7,
              })}{" "}
              SUI
            </strong>
          </div>
        </Flex>
      )}
    />
  );
}

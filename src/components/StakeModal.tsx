import { z } from "zod";
import { Flex, Text } from "@radix-ui/themes";
import { FormModal } from "../components/FormModal";
import { FieldText } from "../components/Form";

const schema = z.object({
  amount: z
    .string()
    .regex(/^\d+$/, "Enter amount in base units (e.g., 100000 = 1 NVR)."),
});

export function StakeModal({
  onStake,
  minStake,
}: {
  minStake: number;
  onStake: (values: z.infer<typeof schema>) => Promise<void> | void;
}) {
  return (
    <FormModal
      trigger={<button className="btn btn-primary">Stake</button>}
      title="Stake NVR"
      description={`Minimum required: ${(
        minStake / 1_000_000
      ).toLocaleString()} NVR`}
      size="sm"
      schema={schema}
      defaultValues={{ amount: String(minStake / 1_000_000) }}
      onSubmit={onStake}
      submitLabel="Stake"
      cancelLabel="Cancel"
      render={() => (
        <Flex direction="column" gap="3">
          <FieldText
            name="amount"
            label="Amount"
            required
            inputMode="numeric"
            hint="1 = 1 NVR"
          />
          <Text size="1" color="gray">
            Your wallet will be asked to sign a transaction.
          </Text>
        </Flex>
      )}
    />
  );
}

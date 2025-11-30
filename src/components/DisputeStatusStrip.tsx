// src/components/DisputeStatusStrip.tsx
import { Flex, Text, Box } from "@radix-ui/themes";

const PERIOD_ORDER: Array<"evidence" | "voting" | "appeal" | "reward"> = [
  "evidence",
  "voting",
  "appeal",
  "reward",
];

export function DisputeStatusStrip({
  status,
  period,
}: {
  status: string;
  period: string | null;
}) {
  return (
    <Box
      style={{
        borderRadius: "999px",
        padding: "6px 10px",
        background: "var(--gray-a2)",
      }}
    >
      <Flex direction="column" gap="1">
        <Flex justify="between" align="center" gap="3">
          <Text size="1" weight="medium">
            Status: <span style={{ color: "var(--teal-dark)" }}>{status}</span>
          </Text>
          {period && (
            <Text size="1" weight="medium">
              Period:{" "}
              <span style={{ color: "var(--teal-dark)" }}>{period}</span>
            </Text>
          )}
        </Flex>

        <Flex gap="4" mt="1">
          {PERIOD_ORDER.map((p) => {
            const active = period === p;
            return (
              <Flex
                key={p}
                direction="column"
                align="center"
                style={{ flex: 1, minWidth: 0 }}
              >
                <Box
                  style={{
                    width: "100%",
                    height: 4,
                    borderRadius: 999,
                    backgroundColor: active
                      ? "var(--teal-dark)"
                      : "var(--gray-a6)",
                    transition: "background-color 0.2s ease-out",
                  }}
                />
                <Text
                  size="1"
                  style={{
                    marginTop: 2,
                    textTransform: "capitalize",
                    opacity: active ? 1 : 0.6,
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {p}
                </Text>
              </Flex>
            );
          })}
        </Flex>
      </Flex>
    </Box>
  );
}

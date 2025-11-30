import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Flex,
  Heading,
  Card,
  DataList,
  Text,
  Button,
} from "@radix-ui/themes";
import { useDispute } from "../store/useDispute";
import { DisputeStatusStrip } from "../components/DisputeStatusStrip";
import { NivraCourtActions } from "../components/NivraCourtActions";
import "../styles/dispute-court-page.css";

export default function DisputeCourtPage() {
  const { disputeId } = useParams<{ disputeId: string }>();
  const navigate = useNavigate();
  const { dispute, loading, error, period, statusLabel } =
    useDispute(disputeId);

  if (loading) {
    return (
      <Container p="4" className="dispute-page dispute-page--loading">
        <Card className="dispute-page__card">
          <Text>Loading dispute…</Text>
        </Card>
      </Container>
    );
  }

  if (error || !dispute) {
    return (
      <Container p="4" className="dispute-page">
        <Card className="dispute-page__card">
          <Text color="red">Failed to load dispute.</Text>
          <Button
            mt="2"
            variant="soft"
            color="gray"
            onClick={() => navigate(-1)}
          >
            ← Back
          </Button>
        </Card>
      </Container>
    );
  }

  const initDate = new Date(
    Number(dispute.timetable.fields.round_init_ms ?? 0)
  );

  const winnerOption =
    typeof dispute.winner_option === "number" ||
    typeof dispute.winner_option === "string"
      ? dispute.options[Number(dispute.winner_option)] ?? "Not decided yet"
      : "Not decided yet";

  const votesTotal = Array.isArray(dispute.result)
    ? dispute.result.reduce((sum: number, a: any) => sum + Number(a ?? 0), 0)
    : 0;

  return (
    <Container p="4" pt="0" mt="4" className="dispute-page">
      <Box className="dispute-page__shell">
        {/* HEADER */}
        <header className="dispute-page__header">
          <div className="dispute-page__header-left">
            <Button
              variant="soft"
              color="gray"
              onClick={() => navigate(-1)}
              className="dispute-page__back-btn"
            >
              ← Back
            </Button>

            <div>
              <Heading as="h1" size="4" className="dispute-page__title">
                Dispute Court
              </Heading>
              <Text size="1" className="dispute-page__subtitle">
                {dispute.description || "No description provided."}
              </Text>
            </div>
          </div>

          <div className="dispute-page__header-right">
            <span className="dispute-page__pill">
              ID:{" "}
              <span className="dispute-page__pill-value">
                {dispute.id.id.slice(0, 10)}…
              </span>
            </span>
          </div>
        </header>

        {/* CONTENT */}
        <main className="dispute-page__content">
          {/* LEFT: SUMMARY / META */}
          <section className="dispute-page__summary">
            <Card className="dispute-page__summary-card">
              <Flex direction="column" gap="4">
                <DisputeStatusStrip status={statusLabel} period={period} />

                <Flex className="dispute-page__badges-row" gap="2" wrap="wrap">
                  <span className="dispute-page__badge">
                    <span className="dispute-page__badge-label">Round</span>
                    <span className="dispute-page__badge-value">
                      {dispute.round}
                    </span>
                  </span>
                  <span className="dispute-page__badge">
                    <span className="dispute-page__badge-label">
                      Total votes
                    </span>
                    <span className="dispute-page__badge-value">
                      {votesTotal}
                    </span>
                  </span>
                  <span className="dispute-page__badge">
                    <span className="dispute-page__badge-label">Verdict</span>
                    <span className="dispute-page__badge-value">
                      {winnerOption}
                    </span>
                  </span>
                </Flex>

                <Flex gap="4" wrap="wrap" className="dispute-page__meta-grid">
                  <DataList.Root size="1" className="dispute-page__datalist">
                    <DataList.Item>
                      <DataList.Label>Dispute ID</DataList.Label>
                      <DataList.Value>
                        <a
                          href={`https://suiscan.xyz/testnet/object/${dispute.id.id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {dispute.id.id}
                        </a>
                      </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.Label>Contract</DataList.Label>
                      <DataList.Value>
                        <a
                          href={`https://suiscan.xyz/testnet/object/${dispute.contract}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {dispute.contract}
                        </a>
                      </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.Label>Initiator</DataList.Label>
                      <DataList.Value>
                        <a
                          href={`https://suiscan.xyz/testnet/account/${dispute.initiator}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {dispute.initiator}
                        </a>
                      </DataList.Value>
                    </DataList.Item>
                  </DataList.Root>

                  <DataList.Root size="1" className="dispute-page__datalist">
                    <DataList.Item>
                      <DataList.Label>Created</DataList.Label>
                      <DataList.Value>
                        {initDate.toLocaleString()}
                      </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.Label>Options</DataList.Label>
                      <DataList.Value>
                        {dispute.options.join(" / ")}
                      </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.Label>Status</DataList.Label>
                      <DataList.Value className="dispute-page__status-chip">
                        {statusLabel}
                      </DataList.Value>
                    </DataList.Item>
                  </DataList.Root>
                </Flex>
              </Flex>
            </Card>
          </section>

          {/* RIGHT / BELOW: COURT ACTIONS */}
          <section className="dispute-page__actions">
            <NivraCourtActions
              dispute={dispute}
              statusLabel={statusLabel}
              period={period}
            />
          </section>
        </main>
      </Box>
    </Container>
  );
}

import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  DataList,
} from "@radix-ui/themes";
import { EvidenceDialog } from "./EvidenceDialog";
import { WALRUS_AGGREGATOR_URL } from "../constants";
import { useDisputeRoles } from "../store/useDisputeRoles";
import { useDisputeEvidence } from "../store/useDisputeEvidence";
import { useDisputeActions } from "../store/useDisputeActions";

import "../styles/nivra-court-actions.css";
import { useDispute } from "../store/useDispute";

export function NivraCourtActions({
  dispute,
  statusLabel,
  period,
}: {
  dispute: any;
  statusLabel: string;
  period: string | null;
}) {
  const { partyCap, voterCap, isPartyMember, cancellable } = useDisputeRoles(
    dispute,
    period
  );
  const { evidenceGroups, refetchEvidence } = useDisputeEvidence(dispute);
  const { refetchDispute } = useDispute(dispute.id.id);
  const {
    voteOption,
    tallyVotes,
    appeal,
    cancelDispute,
    claimRewards,
    handleDisputeTie,
  } = useDisputeActions({ dispute, partyCap, voterCap, refetchDispute });

  const votingButtons =
    period === "voting"
      ? dispute.options.map((option: string, i: number) => (
          <Button
            key={`opt-${i}`}
            onClick={() => voteOption(i)}
            className="court-actions__vote-btn court-actions__vote-btn--active"
          >
            {option}
          </Button>
        ))
      : dispute.options.map((option: string, i: number) => (
          <Button
            key={`opt-g-${i}`}
            className="court-actions__vote-btn court-actions__vote-btn--disabled"
          >
            {option}
          </Button>
        ));

  return (
    <Flex direction="column" gap="5" mt="4" className="court-actions">
      {/* Evidence section */}
      <section className="court-actions__section">
        <Flex justify="between" align="center" mb="3" wrap="wrap" gap="2">
          <Heading size="3">Evidence</Heading>
          {period === "evidence" && isPartyMember && partyCap && (
            <EvidenceDialog
              disputeID={dispute.id.id}
              partyCap={partyCap}
              onCreated={refetchEvidence}
            />
          )}
        </Flex>

        {evidenceGroups.length === 0 ? (
          <Card className="court-actions__empty-card">
            <Text size="2" color="gray">
              No evidence has been submitted yet.
            </Text>
          </Card>
        ) : (
          <Flex direction="column" gap="3">
            {evidenceGroups.map((group) => (
              <Card key={group.author} className="court-actions__evidence-card">
                <Flex justify="between" align="center" mb="2" wrap="wrap">
                  <Text size="1" color="gray">
                    Evidence by{" "}
                    <a
                      href={`https://suiscan.xyz/testnet/account/${group.author}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {group.author}
                    </a>
                  </Text>
                </Flex>

                <Flex gap="3" wrap="wrap">
                  {group.items.map((item, index) => (
                    <Box key={item.id} className="court-actions__evidence-item">
                      <DataList.Root size="1">
                        <DataList.Item>
                          <DataList.Label minWidth="72px">#</DataList.Label>
                          <DataList.Value>{index + 1}</DataList.Value>
                        </DataList.Item>
                        <DataList.Item>
                          <DataList.Label minWidth="72px">
                            Description
                          </DataList.Label>
                          <DataList.Value>{item.description}</DataList.Value>
                        </DataList.Item>
                        {item.blobId && (
                          <DataList.Item>
                            <DataList.Label minWidth="72px">
                              File
                            </DataList.Label>
                            <DataList.Value>
                              <a
                                href={`${WALRUS_AGGREGATOR_URL}/v1/blobs/${item.blobId}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open attachment
                              </a>
                            </DataList.Value>
                          </DataList.Item>
                        )}
                      </DataList.Root>
                    </Box>
                  ))}
                </Flex>
              </Card>
            ))}
          </Flex>
        )}
      </section>

      <Box className="court-actions__divider" />

      {/* Voting section */}
      <section className="court-actions__section">
        <Flex justify="center" mb="3">
          <Heading size="3">Vote</Heading>
        </Flex>

        <Flex
          gap="3"
          justify="center"
          wrap="wrap"
          className="court-actions__vote-grid"
        >
          {votingButtons}
        </Flex>

        <Flex gap="3" mt="4" wrap="wrap" className="court-actions__action-row">
          {period === "appeal" && statusLabel === "active" && (
            <Button onClick={tallyVotes} className="court-actions__cta-btn">
              Tally Votes
            </Button>
          )}
          {period === "appeal" && statusLabel === "tallied" && (
            <Button
              onClick={appeal}
              className="court-actions__cta-btn court-actions__cta-btn--secondary"
            >
              Appeal
            </Button>
          )}
          {period === "appeal" && statusLabel === "tie" && (
            <Button
              onClick={handleDisputeTie}
              className="court-actions__cta-btn court-actions__cta-btn--secondary"
            >
              Draw 1 More Nivster
            </Button>
          )}
          {period === "reward" && statusLabel === "tallied" && (
            <Button onClick={claimRewards} className="court-actions__cta-btn">
              Claim Rewards
            </Button>
          )}
          {isPartyMember && cancellable && (
            <Button
              onClick={cancelDispute}
              className="court-actions__cta-btn court-actions__cta-btn--danger"
            >
              Cancel Dispute
            </Button>
          )}
        </Flex>
      </section>
    </Flex>
  );
}

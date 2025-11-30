import { useMemo, useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSignPersonalMessage,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useNetworkVariable } from "../networkConfig";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { SealClient, SessionKey } from "@mysten/seal";
import { fromHex } from "@mysten/sui/utils";
import { SEAL_KEY_SERVERS } from "../constants";
import { toast } from "react-hot-toast";

interface UseDisputeActionsArgs {
  dispute: any | null;
  partyCap: any | null;
  voterCap: any | null;
  refetchDispute?: () => Promise<void> | void;
}

export function useDisputeActions({
  dispute,
  partyCap,
  voterCap,
  refetchDispute,
}: UseDisputeActionsArgs) {
  const [decryptionKey, setDecryptionKey] = useState<Uint8Array>(
    new Uint8Array([])
  );

  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const { mutate: signPersonalMessage } = useSignPersonalMessage();
  const packageId = useNetworkVariable("package_id");
  const registryId = useNetworkVariable("registry_id");

  const sealClient = useMemo(
    () =>
      new SealClient({
        suiClient,
        serverConfigs: SEAL_KEY_SERVERS.map((id) => ({
          objectId: id,
          weight: 1,
        })),
        verifyKeyServers: false,
      }),
    [suiClient]
  );

  const runWithRefetch = async (
    action: () => Promise<void>,
    successMessage: string
  ) => {
    try {
      await action();
      toast.success(successMessage);
      if (refetchDispute) {
        await refetchDispute();
      }
    } catch (err) {
      console.error(err);
      toast.error("Transaction failed. Please try again.");
      throw err;
    }
  };

  if (!dispute) {
    return {
      voteOption: async () => {},
      tallyVotes: async () => {},
      appeal: async () => {},
      cancelDispute: async () => {},
      claimRewards: async () => {},
      handleDisputeTie: async () => {},
      decryptionKey,
    };
  }

  const voteOption = async (opt: number) => {
    if (!voterCap || !currentAccount) return;

    await runWithRefetch(async () => {
      const tx = new Transaction();

      const { encryptedObject, key } = await sealClient.encrypt({
        threshold: 1,
        packageId,
        id: dispute.id.id,
        data: new Uint8Array([opt]),
        aad: fromHex(currentAccount.address),
        demType: 1,
      });

      setDecryptionKey(key);

      tx.moveCall({
        target: `${packageId}::dispute::cast_vote`,
        arguments: [
          tx.object(dispute.id.id),
          tx.pure.vector("u8", encryptedObject),
          tx.object(voterCap.id.id),
          tx.object.clock(),
        ],
      });

      await signAndExecute({ transaction: tx });
    }, "Your vote has been submitted.");
  };

  const tallyVotes = async () => {
    if (!currentAccount) return;

    await runWithRefetch(async () => {
      // 1. Create session key
      const sessionKey = await SessionKey.create({
        address: currentAccount.address,
        packageId,
        ttlMin: 10,
        suiClient,
      });

      const message = sessionKey.getPersonalMessage();

      // 2. Ask wallet to sign session key message
      await new Promise<void>((resolve, reject) => {
        signPersonalMessage(
          { message },
          {
            onSuccess: (result) => {
              sessionKey.setPersonalMessageSignature(result.signature);
              resolve();
            },
            onError: (err) => reject(err),
          }
        );
      });

      // 3. seal_approve
      const txApprove = new Transaction();
      txApprove.moveCall({
        target: `${packageId}::dispute::seal_approve`,
        arguments: [
          txApprove.pure.vector("u8", fromHex(dispute.id.id)),
          txApprove.object(dispute.id.id),
          txApprove.object.clock(),
        ],
      });

      const txBytes = await txApprove.build({
        client: suiClient,
        onlyTransactionKind: true,
      });

      // 4. Derived keys from seal
      const derivedKeys = await sealClient.getDerivedKeys({
        kemType: 0,
        id: dispute.id.id,
        txBytes,
        sessionKey,
        threshold: 1,
      });

      const keyServersUsed = Array.from(derivedKeys.keys());
      const derivedKeysUsed = Array.from(derivedKeys.values()).map((dk) =>
        fromHex(dk.representation)
      );

      // 5. finalize_vote
      const txFinalize = new Transaction();
      txFinalize.moveCall({
        target: `${packageId}::dispute::finalize_vote`,
        arguments: [
          txFinalize.object(dispute.id.id),
          txFinalize.pure.address(packageId),
          txFinalize.pure.vector("vector<u8>", derivedKeysUsed),
          txFinalize.pure.vector("address", keyServersUsed),
          txFinalize.object.clock(),
        ],
      });

      // We only actually send the finalize tx (your original code only signed tx2)
      await signAndExecute({ transaction: txFinalize });
    }, "Votes have been tallied.");
  };

  const cancelDispute = async () => {
    await runWithRefetch(async () => {
      const tx = new Transaction();
      tx.moveCall({
        target: `${packageId}::court::cancel_dispute`,
        arguments: [
          tx.object(dispute.court),
          tx.object(dispute.id.id),
          tx.object.clock(),
        ],
      });
      await signAndExecute({ transaction: tx });
    }, "Dispute has been cancelled.");
  };

  const claimRewards = async () => {
    await runWithRefetch(async () => {
      const tx = new Transaction();
      tx.moveCall({
        target: `${packageId}::court::distribute_rewards`,
        arguments: [
          tx.object(dispute.court),
          tx.object(dispute.id.id),
          tx.object(registryId),
          tx.object.clock(),
        ],
      });
      await signAndExecute({ transaction: tx });
    }, "Rewards claimed successfully.");
  };

  const handleDisputeTie = async () => {
    await runWithRefetch(async () => {
      const tx = new Transaction();
      tx.moveCall({
        target: `${packageId}::court::handle_dispute_tie`,
        arguments: [
          tx.object(dispute.court),
          tx.object(dispute.id.id),
          tx.object.clock(),
          tx.object.random(),
        ],
      });
      await signAndExecute({ transaction: tx });
    }, "Tie handling transaction submitted.");
  };

  const appeal = async () => {
    if (!partyCap) return;

    await runWithRefetch(async () => {
      const tx = new Transaction();

      // get fee rate from the court
      const court = await suiClient.getObject({
        id: dispute.court,
        options: { showContent: true },
      });

      const innerCourtDynamicFieldId =
        court.data.content.fields.inner.fields.id.id;

      const innerCourtDynamicField = await suiClient.getDynamicFields({
        parentId: innerCourtDynamicFieldId,
      });

      const innerCourtId = innerCourtDynamicField.data[0].objectId;

      const innerCourt = await suiClient.getObject({
        id: innerCourtId,
        options: { showContent: true },
      });

      const fee_rate = innerCourt.data.content.fields.value.fields.fee_rate;

      tx.moveCall({
        target: `${packageId}::court::open_appeal`,
        arguments: [
          tx.object(dispute.court),
          tx.object(dispute.id.id),
          coinWithBalance({
            // appeal fee = fee rate * current nivster count
            balance: BigInt(fee_rate * parseInt(dispute.voters.fields.size)),
          }),
          tx.object(partyCap.id.id),
          tx.object.clock(),
          tx.object.random(),
        ],
      });

      await signAndExecute({ transaction: tx });
    }, "Appeal submitted.");
  };

  return {
    voteOption,
    tallyVotes,
    appeal,
    cancelDispute,
    claimRewards,
    handleDisputeTie,
    decryptionKey,
  };
}

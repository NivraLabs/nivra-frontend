import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../networkConfig";
import { Transaction } from "@mysten/sui/transactions";
import { WALRUS_PUBLISHER_URL } from "../constants";
import { toast } from "react-hot-toast";

type CreateEvidenceInput = {
  disputeID: string;
  partyCapId: string;
  description: string;
  file?: File | null;
};

export function useCreateEvidence() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const packageId = useNetworkVariable("package_id");

  const createEvidence = async (input: CreateEvidenceInput) => {
    const { disputeID, partyCapId, description, file } = input;

    setLoading(true);
    setError(null);

    try {
      const tx = new Transaction();

      let type: string | null = null;
      let subtype: string | null = null;
      let blobId: string | null = null;
      let fileName: string | null = null;

      // Upload file to Walrus (if provided)
      if (file) {
        const [mainType, subType] = file.type.split("/") as [string, string];

        const res = await fetch(
          `${WALRUS_PUBLISHER_URL}/v1/blobs?epochs=${3}`,
          {
            method: "PUT",
            body: file,
          }
        );

        if (!res.ok) {
          throw new Error(`Walrus upload failed with status ${res.status}`);
        }

        const info = await res.json();

        type = mainType;
        subtype = subType;
        blobId = info.newlyCreated.blobObject.blobId;
        fileName = file.name;
      }

      tx.moveCall({
        target: `${packageId}::evidence::create_evidence`,
        arguments: [
          tx.object(disputeID), // dispute
          tx.pure.string(description), // desc
          tx.pure.option("string", blobId), // walrus blob id
          tx.pure.option("string", fileName),
          tx.pure.option("string", type), // file type
          tx.pure.option("string", subtype), // file subtype
          tx.object(partyCapId), // party cap
          tx.object.clock(),
        ],
      });

      await signAndExecute({ transaction: tx });

      toast.success("Evidence added successfully.");
    } catch (err) {
      console.error("Failed to create evidence", err);
      setError(err);
      toast.error("Failed to add evidence. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createEvidence, loading, error };
}

// src/lib/getCourtStake.ts
import type { SuiClient } from "@mysten/sui/client";

export async function getCourtStake(
  suiClient: SuiClient,
  courtId: string,
  userAddress: string
): Promise<{ feeRate: number; stakedAmount: number }> {
  // Outer court object
  const court = await suiClient.getObject({
    id: courtId,
    options: { showContent: true },
  });

  const innerCourtDynamicFieldId =
    // @ts-expect-error loose Sui types
    court.data.content.fields.inner.fields.id.id as string;

  const innerCourtDynamicField = await suiClient.getDynamicFields({
    parentId: innerCourtDynamicFieldId,
  });

  const innerCourtId = innerCourtDynamicField.data[0].objectId;

  const innerCourt = await suiClient.getObject({
    id: innerCourtId,
    options: { showContent: true },
  });

  const feeRate =
    // @ts-expect-error loose Sui types
    Number(innerCourt.data.content.fields.value.fields.fee_rate) || 0;

  const stakesDynamicFieldId =
    // @ts-expect-error loose Sui types
    innerCourt.data.content.fields.value.fields.stakes.fields.id.id as string;

  const stakesDynamicFields = await suiClient.getDynamicFields({
    parentId: stakesDynamicFieldId,
  });

  const userStake = stakesDynamicFields.data.find(
    (s) =>
      // @ts-expect-error loose Sui types
      s.name?.value?.toLowerCase?.() === userAddress.toLowerCase()
  );

  if (!userStake) {
    return { feeRate, stakedAmount: 0 };
  }

  const stakeObj = await suiClient.getObject({
    id: userStake.objectId,
    options: { showContent: true },
  });

  const stakedAmount =
    // @ts-expect-error loose Sui types
    Number(stakeObj.data.content.fields.value.fields.value.fields.amount) || 0;

  return { feeRate, stakedAmount };
}

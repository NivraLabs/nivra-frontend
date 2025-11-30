import * as Dialog from "@radix-ui/react-dialog";

export default function TxStatusModal({
  open,
  onClose,
  status = "pending",
  title = "Transaction",
}: {
  open: boolean;
  onClose: () => void;
  status?: "pending" | "success" | "error";
  title?: string;
}) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <h3>{title}</h3>
          {status === "pending" && <div>Transaction pending…</div>}
          {status === "success" && <div>Transaction confirmed ✅</div>}
          {status === "error" && <div>Transaction failed ❌</div>}
          <div
            style={{
              marginTop: 12,
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
            }}
          >
            <Dialog.Close asChild>
              <button className="btn btn-ghost">Close</button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

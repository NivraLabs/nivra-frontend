import * as React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormSubmit,
} from "@radix-ui/react-form";
import { Button, Dialog, Flex, Text, TextArea } from "@radix-ui/themes";
import "../styles/evidence-dialog.css";
import { useCreateEvidence } from "../store/useCreateEvidence";

type EvidenceDialogProps = {
  disputeID: string;
  partyCap: {
    id: { id: string };
  };
  onCreated?: () => void; // new: callback when evidence is successfully created
};

export const EvidenceDialog: React.FC<EvidenceDialogProps> = ({
  disputeID,
  partyCap,
  onCreated,
}) => {
  const [open, setOpen] = React.useState(false);
  const { createEvidence, loading } = useCreateEvidence();

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const formEl = event.currentTarget;
    const formData = new FormData(formEl);
    const description = String(formData.get("description") ?? "");

    const fileEntry = formData.get("file");
    const file =
      fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : undefined;

    try {
      await createEvidence({
        disputeID,
        partyCapId: partyCap.id.id,
        description,
        file,
      });

      formEl.reset();
      setOpen(false);
      onCreated?.(); // notify parent to refetch evidence
    } catch {
      // errors already handled with toast in the hook
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button className="evidence-dialog__trigger-btn">+ Add Evidence</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="520px" className="evidence-dialog">
        <div className="evidence-dialog__header">
          <Dialog.Title className="evidence-dialog__title">
            Add Evidence
          </Dialog.Title>
          <Dialog.Description className="evidence-dialog__description">
            Provide a short description and optionally attach a file to support
            your case.
          </Dialog.Description>
        </div>

        <Form onSubmit={submitForm} className="evidence-dialog__form">
          <Flex direction="column" gap="3">
            <FormField name="description">
              <FormLabel className="evidence-dialog__label">
                Description
              </FormLabel>
              <FormControl asChild>
                <TextArea
                  placeholder="Explain how this evidence relates to the dispute…"
                  name="description"
                  required
                  rows={4}
                  className="evidence-dialog__textarea"
                />
              </FormControl>
              <Text size="1" color="gray" className="evidence-dialog__hint">
                Keep it clear and factual. This will be visible to other
                participants.
              </Text>
            </FormField>

            <FormField name="file">
              <FormLabel className="evidence-dialog__label">
                Attachment (optional)
              </FormLabel>
              <FormControl asChild>
                <div className="evidence-dialog__file-wrapper">
                  <input
                    type="file"
                    name="file"
                    className="evidence-dialog__file-input"
                  />
                  <div className="evidence-dialog__file-meta">
                    <Text size="2" weight="medium">
                      Click to choose a file
                    </Text>
                    <Text size="1" color="gray">
                      PDFs, images or documents. Max size depends on your wallet
                      / network.
                    </Text>
                  </div>
                </div>
              </FormControl>
            </FormField>
          </Flex>

          <Flex
            gap="3"
            mt="4"
            justify="end"
            className="evidence-dialog__actions"
          >
            <Dialog.Close disabled={loading}>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <FormSubmit asChild>
              <Button
                className="evidence-dialog__primary-btn"
                disabled={loading}
              >
                {loading ? "Saving…" : "Save evidence"}
              </Button>
            </FormSubmit>
          </Flex>
        </Form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

// components/ui/FormModal.tsx
import * as React from "react";
import { Modal, ModalProps } from "./Modal";
import { Form } from "./Form";
import { z } from "zod";

type FormModalProps<TSchema extends z.ZodTypeAny> = Omit<
  ModalProps,
  "children" | "footer"
> & {
  schema: TSchema;
  defaultValues?: z.infer<TSchema>;
  onSubmit: (values: z.infer<TSchema>) => Promise<void> | void;
  submitLabel?: string;
  cancelLabel?: string;
  /** Render prop to place inputs */
  render: () => React.ReactNode;
};

export function FormModal<TSchema extends z.ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  submitLabel,
  cancelLabel,
  render,
  ...modalProps
}: FormModalProps<TSchema>) {
  const [open, setOpen] = React.useState(false);
  return (
    <Modal
      {...modalProps}
      open={modalProps.open ?? open}
      onOpenChange={modalProps.onOpenChange ?? setOpen}
      footer={null}
    >
      <Form
        schema={schema}
        defaultValues={defaultValues}
        onSubmit={async (v) => {
          await onSubmit(v);
          setOpen(false);
        }}
        submitLabel={submitLabel}
        cancelLabel={cancelLabel}
        onCancel={() => setOpen(false)}
      >
        {render()}
      </Form>
    </Modal>
  );
}

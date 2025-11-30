// components/ui/Modal.tsx
import * as React from "react";
import { Dialog, Flex, Heading, Text, IconButton } from "@radix-ui/themes";
import { Cross2Icon } from "@radix-ui/react-icons";

export type ModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement; // must be a single element
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  modal?: boolean;
  hideClose?: boolean;
};

type ResponsiveVal =
  | string
  | { initial?: string; sm?: string; md?: string; lg?: string; xl?: string };

const sizeToWidth: Record<NonNullable<ModalProps["size"]>, ResponsiveVal> = {
  sm: { initial: "92vw", sm: "420px" },
  md: { initial: "92vw", sm: "560px" },
  lg: { initial: "92vw", sm: "720px" },
};

export function Modal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  size = "md",
  modal = true,
  hideClose = false,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal={modal}>
      {trigger ? (
        <Dialog.Trigger asChild>
          {trigger /* exactly one element */}
        </Dialog.Trigger>
      ) : null}

      <Dialog.Content
        maxWidth={sizeToWidth[size]}
        style={{ overflow: "visible" }}
      >
        {(title || !hideClose) && (
          <Flex align="start" justify="between" mb="3">
            {title ? <Heading as="h3">{title}</Heading> : <span />}
            {!hideClose && (
              <Dialog.Close asChild>
                <IconButton
                  variant="ghost"
                  radius="full"
                  size="2"
                  aria-label="Close"
                >
                  <Cross2Icon />
                </IconButton>
              </Dialog.Close>
            )}
          </Flex>
        )}

        {description ? (
          <Text as="p" size="2" color="gray" mb="3">
            {description}
          </Text>
        ) : null}

        <div>{children}</div>

        {footer ? (
          <Flex mt="4" gap="3" justify="end">
            {footer}
          </Flex>
        ) : null}
      </Dialog.Content>
    </Dialog.Root>
  );
}

// src/components/form/Form.tsx
import * as React from "react";
import { z } from "zod";
import {
  useForm,
  FormProvider,
  Controller,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Flex,
  Text,
  TextField,
  TextArea,
  Select,
} from "@radix-ui/themes";

export type FormProps<TSchema extends z.ZodTypeAny> = {
  schema: TSchema;
  defaultValues?: z.infer<TSchema>;
  onSubmit: (values: z.infer<TSchema>) => Promise<void> | void;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  submittingLocksModal?: boolean;
  children: React.ReactNode;
};

export function Form<TSchema extends z.ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
  submittingLocksModal = true,
  children,
}: FormProps<TSchema>) {
  const methods = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onTouched",
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Flex direction="column" gap="3">
          {children}
          {Object.keys(errors).length > 0 && (
            <Text color="red" size="2">
              Please fix the highlighted fields.
            </Text>
          )}
          <Flex gap="3" justify="end" mt="2">
            {onCancel && (
              <Button
                type="button"
                variant="soft"
                onClick={onCancel}
                disabled={submittingLocksModal && isSubmitting}
              >
                {cancelLabel}
              </Button>
            )}
            <Button
              type="submit"
              disabled={(submittingLocksModal && isSubmitting) || !isValid}
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </Button>
          </Flex>
        </Flex>
      </form>
    </FormProvider>
  );
}

/* ---------------- Field components ---------------- */

type BaseFieldProps = {
  name: string;
  label?: string;
  hint?: string;
  required?: boolean;
};

function useFormContextSafe() {
  const ctx = useFormContext();
  if (!ctx) throw new Error("Field components must be used inside <Form>.");
  return ctx;
}

function FieldMessage({
  error,
  hint,
}: {
  error?: { message?: string };
  hint?: string;
}) {
  if (error?.message) {
    return (
      <Text size="1" color="red">
        {error.message}
      </Text>
    );
  }
  return hint ? (
    <Text size="1" color="gray">
      {hint}
    </Text>
  ) : null;
}

export function FieldText({
  name,
  label,
  hint,
  required,
  onChange,
  type = "text",
  ...rest
}: BaseFieldProps &
  Omit<
    React.ComponentProps<typeof TextField.Input>,
    "value" | "onChange" | "defaultValue"
  >) {
  const { control } = useFormContextSafe();
  const inputId = React.useId();

  return (
    <Controller
      name={name as any}
      control={control}
      render={({ field, fieldState }) => (
        <Flex direction="column" gap="1">
          {label && (
            <Text as="label" htmlFor={inputId} weight="medium">
              {label} {required ? "*" : ""}
            </Text>
          )}

          <TextField.Root
            {...rest}
            color={fieldState.error ? "red" : undefined}
            variant={fieldState.error ? "soft" : undefined}
            id={inputId}
            ref={field.ref}
            name={field.name}
            type={type}
            value={field.value ?? ""} // ensure controlled
            onChange={(e) => {
              field.onChange(e.target.value);
              onChange && onChange(e);
            }}
            onBlur={field.onBlur}
          ></TextField.Root>

          <FieldMessage error={fieldState.error} hint={hint} />
        </Flex>
      )}
    />
  );
}

export function FieldTextarea({
  name,
  label,
  hint,
  required,
  rows = 4,
  ...rest
}: BaseFieldProps & React.ComponentProps<typeof TextArea>) {
  const { control } = useFormContextSafe();
  return (
    <Controller
      name={name as any}
      control={control}
      render={({ field, fieldState }) => (
        <Flex direction="column" gap="1">
          {label && (
            <Text as="label" weight="medium">
              {label} {required ? "*" : ""}
            </Text>
          )}
          <TextArea
            {...rest}
            {...field}
            rows={rows}
            resize="vertical"
            color={fieldState.error ? "red" : undefined}
            variant={fieldState.error ? "soft" : undefined}
          />
          <FieldMessage error={fieldState.error} hint={hint} />
        </Flex>
      )}
    />
  );
}

export function FieldSelect({
  name,
  label,
  hint,
  required,
  placeholder = "Select…",
  items,
}: BaseFieldProps & {
  placeholder?: string;
  items: { value: string; label: string }[];
}) {
  const { control } = useFormContextSafe();
  return (
    <Controller
      name={name as any}
      control={control}
      render={({ field, fieldState }) => (
        <Flex direction="column" gap="1">
          {label && (
            <Text as="label" weight="medium">
              {label} {required ? "*" : ""}
            </Text>
          )}
          <Select.Root value={field.value ?? ""} onValueChange={field.onChange}>
            <Select.Trigger
              placeholder={placeholder}
              color={fieldState.error ? "red" : undefined}
              variant={fieldState.error ? "soft" : undefined}
            />
            <Select.Content>
              {items.map((opt) => (
                <Select.Item key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <FieldMessage error={fieldState.error} hint={hint} />
        </Flex>
      )}
    />
  );
}

"use client";

import {
  DefaultValues,
  FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { ZodType } from "zod";

interface GenericFormProps<T extends FieldValues> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ZodType<T, any, any>;
  onSubmit: (data: T) => Promise<void> | void;
  children: React.ReactNode;
  submitText: string;
  defaultValues?: DefaultValues<T>;
  buttons?: React.ReactNode;
  // props: React.FormHTMLAttributes<HTMLFormElement>;
}

export default function GenericForm<T extends FieldValues>(
  props: GenericFormProps<T>,
) {
  const methods = useForm({
    resolver: zodResolver(props.schema),
    defaultValues: props?.defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(props.onSubmit)}
        className="flex flex-col gap-6"
      >
        {props.children}
        <Buttons>
          <Button variant={"default"} type="submit" disabled={isSubmitting}>
            {methods.formState.isSubmitting ? "Enviando..." : props.submitText}
          </Button>
          {props.buttons}
        </Buttons>
      </form>
    </FormProvider>
  );
}

const Buttons = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-4 flex flex-col gap-4 font-bold">{children}</div>;
};

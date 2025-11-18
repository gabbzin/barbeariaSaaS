import {
  Control,
  Controller,
  FieldValues,
  Path,
  useFormContext,
} from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface InputFormProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  placeholder?: string;
  type?: string;
  control?: Control<T>;
}

const InputForm = <T extends FieldValues>({
  label,
  type = "text",
  name,
  placeholder,
  control: propsControl,
}: InputFormProps<T>) => {
  const context = useFormContext<T>();
  const control = propsControl || context?.control;

  if (!control) {
    throw new Error(
      "InputForm deve ser usado dentro de um FormProvider ou receber a prop 'control'.",
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <Input type={type} placeholder={placeholder} {...field} />
            <p className="text-sm text-red-500">{fieldState.error?.message}</p>
          </>
        )}
      />
    </div>
  );
};

export default InputForm;

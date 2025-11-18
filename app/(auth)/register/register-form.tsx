"use client";

import InputForm from "@/app/_components/form/input-form";
import GenericForm from "@/app/_components/form/generic-form";
import { registerSchema, registerSchemaType } from "@/schemas/userSchema";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation"; // Use router.push em Client Components
import { GoogleButton } from "@/app/_components/google-button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { toast } from "sonner";

const RegisterForm = () => {
  const router = useRouter();

  const handleRegister = async (data: registerSchemaType) => {
    try {
      await authClient.signUp.email({
        name: data.nome,
        email: data.email,
        password: data.senha,
      });
      router.push("/");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao criar conta. Tente novamente.",
      );
    }
  };

  return (
    <Card className="w-full max-w-md ">
      <CardHeader className="text-center text-3xl font-bold">
        Criar conta
      </CardHeader>
      <CardContent className="p-8">
        <GenericForm<registerSchemaType>
          schema={registerSchema}
          onSubmit={handleRegister}
          submitText="Criar conta"
          buttons={<GoogleButton />}
        >
          <InputForm
            name="nome"
            label="Nome"
            type="text"
            placeholder="Digite seu nome"
          />
          <InputForm
            name="email"
            label="Email"
            type="email"
            placeholder="Digite seu email"
          />
          <InputForm
            name="senha"
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
          />
        </GenericForm>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;

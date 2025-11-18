"use client";

import InputForm from "@/app/_components/form/input-form";
import GenericForm from "@/app/_components/form/generic-form";
import {
  loginSchemaType,
  registerSchema,
  registerSchemaType,
} from "@/schemas/userSchema";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation"; // Use router.push em Client Components
import { GoogleButton } from "@/app/_components/google-button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();

  const handleLogin = async (data: loginSchemaType) => {
    try {
      await authClient.signIn.email({
        email: data.email,
        password: data.senha,
      });
      router.push("/");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao fazer login. Tente novamente.",
      );
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center text-3xl font-bold">
        Fazer login
      </CardHeader>
      <CardContent className="p-8">
        <GenericForm<loginSchemaType>
          schema={registerSchema}
          onSubmit={handleLogin}
          submitText="Criar conta"
          buttons={<GoogleButton />}
        >
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
}

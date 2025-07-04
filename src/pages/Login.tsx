import { useState } from "react";
import { useForm } from "react-hook-form";
import { A } from "../components/ui/A";
import { Button } from "../components/ui/Button";
import { H1 } from "../components/ui/H1";
import { login, type LoginRequest } from "../services/authService";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "../components/form/Field";
import { redirectTo, showToast } from "../utils/events";

const loginFormSchema = z.object({
  email: z
    .string()
    .nonempty("O email é obrigatório")
    .email("Formato de email inválido"),
  password: z.string().nonempty("A senha é obrigatória"),
});

export const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    setIsSubmitting(true); 
    try {
      const response = await login(data);

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.role);
        showToast("Login realizado com sucesso", "success");
        redirectTo("/dashboard"); 
      } else {
        showToast("Resposta inválida do servidor", "error");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha ao tentar fazer login.";
        showToast(message, "error");
    } finally {
      setIsSubmitting(false); 
    }
  };


  return (
    <div className="flex h-screen w-screen flex-col items-center bg-zinc-200 p-4 text-zinc-700 sm:p-16">
      <div className="grid w-full max-w-4xl grid-cols-1 rounded-md bg-zinc-50 md:grid-cols-2">
        <div className="hidden rounded-s-md bg-green-600 md:block"></div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center gap-4 p-4 sm:p-8"
        >
          <H1>Login</H1>

          <Field
            label="E-mail:"
            type="text"
            placeholder="Digite seu e-mail"
            register={register("email")}
            error={errors.email?.message}
          />

          <Field
            label="Senha:"
            type="password"
            placeholder="Digite sua senha"
            register={register("password")}
            error={errors.password?.message}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>

          <div className="flex flex-col justify-center sm:flex-row sm:justify-between">
            <A className="text-center" href="#">
              Esqueci minha senha
            </A>
            <A to="/educador" className="text-center">
              Criar cadastro
            </A>
          </div>
          <p className="text-center">
            Problemas com o login:{" "}
            <A href="mailto:suporte@omif.com.br">suporte@omif.com.br</A>
          </p>
        </form>
      </div>
    </div>
  );
};

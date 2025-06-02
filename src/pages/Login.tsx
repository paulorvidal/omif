import { useForm } from "react-hook-form";
import { A } from "../components/ui/A";
import { Button } from "../components/ui/Button";
import { H1 } from "../components/ui/H1";
import { useNavigate } from "react-router";
import { login } from "../services/authService";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "../components/form/Field";
import { toast } from "sonner";

const loginFormSchema = z.object({
  email: z
    .string()
    .nonempty("O email é obrigatório")
    .email("Formato de email inválido"),
  password: z.string().nonempty("A senha é obrigatória"),
});

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    const payload = data;
    try {
      const response = await login(payload);

      localStorage.setItem("token", response.token);

      response.token && toast.success("Login realizado com sucesso");

      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
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

          <Button type="submit">Entrar</Button>

          <div className="flex flex-col justify-center sm:flex-row sm:justify-between">
            <A className="text-center" href="#">
              Esqueci minha senha
            </A>
            <A to="/cadastre-se" className="text-center">
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

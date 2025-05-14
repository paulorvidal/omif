import { useState, type FormEvent } from "react";
import { A } from "../components/ui/A";
import { Button } from "../components/ui/Button";
import { H1 } from "../components/ui/H1";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { useNavigate } from "react-router";
import { login } from "../services/authService";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const { token } = await login({ email, password });
      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (error) {
      console.error("Credenciais inválidas.");
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center bg-slate-200 p-4 text-zinc-700 sm:p-16">
      <div className="grid w-full max-w-4xl grid-cols-1 rounded-md bg-slate-50 md:grid-cols-2">
        <div className="hidden rounded-s-md bg-green-600 md:block"></div>
        <form
          onSubmit={handleLogin}
          className="flex flex-col justify-center gap-4 p-4 sm:p-8"
        >
          <H1>Já possui cadastro?</H1>
          <p className="text-center">Faça seu login</p>
          <div>
            <Label>E-mail:</Label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Digite seu e-mail"
              required
            />
          </div>
          <div>
            <Label>Senha:</Label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>
          <Button type="submit">Entrar</Button>
          <div className="flex flex-col justify-center sm:flex-row sm:justify-between">
            <A className="text-center" href="#">
              Esqueci minha senha
            </A>
            <A className="text-center" href="#">
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

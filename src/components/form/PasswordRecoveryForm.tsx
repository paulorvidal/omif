import { usePasswordRecovery } from "../../hooks/usePasswordRecovery";
import { Field } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";
import { ProgressDialog } from "../dialog/ProgressDialog";

export const PasswordRecoveryForm = ({ token }: { token: string }) => {
  const { register, handleSubmit, errors, isPending } =
    usePasswordRecovery(token);

  return (
    <form
      className="flex w-full flex-col justify-center gap-4 rounded-md bg-white p-10 md:max-w-1/2 lg:max-w-1/3"
      onSubmit={handleSubmit}
    >
      <h2 className="text-center text-xl font-semibold text-zinc-800">
        Recuperação de Senha
      </h2>
      <p className="mb-2 text-center text-zinc-600">
        Crie uma nova senha para recuperar o acesso à sua conta.
      </p>

      <div className="grid grid-cols-1 gap-4">
        <Field
          label="Nova Senha:"
          type="password"
          placeholder="Digite sua nova senha"
          register={register("password")}
          error={errors.password?.message}
        />
        <Field
          label="Confirmar Nova Senha:"
          type="password"
          placeholder="Digite a nova senha novamente"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={isPending}>
          Alterar Senha
        </Button>
      </div>

      <ProgressDialog open={isPending} />
    </form>
  );
};

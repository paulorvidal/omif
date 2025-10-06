import { usePasswordRecovery } from "../../hooks/usePasswordRecovery";
import { PasswordField } from "../../components/PasswordField";
import { Button } from "../Button";
import { ProgressDialog } from "../dialog/ProgressDialog";
import { redirectTo, showToast } from "../../utils/events";

export const PasswordRecoveryForm = ({ token }: { token: string }) => {
  const {
    isValidationLoading,
    isValidationError,
    validationErrorMessage,
    register,
    handleSubmit,
    errors,
    isSubmitting,
  } = usePasswordRecovery(token || "");

  if (isValidationError) {
    showToast(validationErrorMessage, "error");
    redirectTo("/login");
  }
  return (
    <form
      className="flex w-full flex-col justify-center gap-4 rounded-md bg-zinc-50 p-10 md:max-w-1/2 lg:max-w-1/3"
      onSubmit={handleSubmit}
    >
      <h2 className="text-center text-xl font-semibold text-zinc-800">
        Recuperação de Senha
      </h2>
      <p className="mb-2 text-center text-zinc-600">
        Crie uma nova senha para recuperar o acesso à sua conta.
      </p>

      <div className="grid grid-cols-1 gap-4">
        <PasswordField
          label="Nova Senha:"
          placeholder="Digite sua nova senha"
          register={register("password")}
          error={errors.password?.message}
        />
        <PasswordField
          label="Confirmar Nova Senha:"
          placeholder="Digite a nova senha novamente"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          Alterar Senha
        </Button>
      </div>

      <ProgressDialog open={isSubmitting || isValidationLoading} />
    </form>
  );
};

import { usePasswordRecovery } from "../../hooks/usePasswordRecovery";
import { Field } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";
import { ProgressDialog } from "../../components/ui/ProgressDialog";


export const PasswordRecoveryForm = ({ token }: { token: string }) => {
    const {
        register,
        handleSubmit,
        errors,
        isPending,
    } = usePasswordRecovery(token);

    return (
        <form
            className="flex w-full md:max-w-1/2 lg:max-w-1/3 flex-col justify-center gap-4 bg-white p-10 rounded-md"
            onSubmit={handleSubmit}
        >
            <h2 className="text-xl font-semibold text-zinc-800 text-center">
                Recuperação de Senha
            </h2>
            <p className="text-zinc-600 text-center mb-2">
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

            <div className="flex justify-end mt-4">
                <Button type="submit" disabled={isPending}>
                    Alterar Senha
                </Button>
            </div>

            <ProgressDialog open={isPending} />
        </form>
    );
}

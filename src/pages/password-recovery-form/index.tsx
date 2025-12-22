import { AppButton } from "@/components/app-button";
import { AppInput } from "@/components/app-input";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { usePasswordRecovery } from "@/hooks/use-password-recovery";
import { ChevronLeft, KeyRound, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function PasswordRecoveryForm() {
  const navigate = useNavigate();

  const { token } = useParams<{ token: string }>();

  if (!token) {
    return (
      <div>O link de recuperação de senha é inválido ou está incompleto.</div>
    );
  }

  const { register, handleSubmit, errors, isSubmitting } = usePasswordRecovery(
    token || "",
  );

  return (
    <div className="flex min-h-svh w-full flex-col items-center p-6 md:p-10">
      <div className="mb-6 flex w-full max-w-5xl items-center gap-4">
        <AppButton
          variant="secondary"
          className="size-8"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="size-4" />
        </AppButton>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <KeyRound className="text-primary h-6 w-6" />
            <h1 className="text-2xl font-bold tracking-tight">
              Recuperação de Senha
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Crie uma nova senha para recuperar o acesso à sua conta.
          </p>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} noValidate>
              <FieldGroup>
                <FieldSet>
                  <FieldGroup>
                    <Field>
                      <AppInput
                        type="password"
                        label="Nova Senha:"
                        placeholder="Digite sua nova senha"
                        register={register("password")}
                        error={errors.password?.message}
                      />
                    </Field>
                  </FieldGroup>
                  <FieldGroup>
                    <Field>
                      <AppInput
                        type="password"
                        label="Confirmar Nova Senha:"
                        placeholder="Digite a nova senha novamente"
                        register={register("confirmPassword")}
                        error={errors.confirmPassword?.message}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <div className="flex justify-end">
                  <AppButton
                    type="submit"
                    isLoading={isSubmitting}
                    icon={<Save />}
                  >
                    Alterar Senha
                  </AppButton>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export { PasswordRecoveryForm };

import { cn } from "@/lib/utils";
import OmifBackground from "../assets/omif-background.png";
import OmifLogo from "../assets/omif-logo.svg";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { AppInput } from "@/components/app-input";
import { AppButton } from "@/components/app-button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/use-login";
import { AppCaptcha } from "@/components/app-captcha";
import { AppDialog } from "@/components/app-dialog";

function Login() {
  const {
    register,
    handleLoginSubmit,
    errors,
    isSubmitting,
    setCaptchaToken,
    captchaResetKey,
    captchaError,
    isVerificationDialogOpen,
    emailForVerification,
    isResending,
    handleResendVerificationLink,
    closeVerificationDialog,
    countdown,
    isApprovalDialogOpen,
    closeApprovalDialog,
    isPasswordRecoveryDialogOpen,
    openPasswordRecoveryDialog,
    closePasswordRecoveryDialog,
    handlePasswordRecoverySubmit,
    isSendingPasswordRecovery,
    maskedEmailForRecovery,
  } = useLogin();

  const navigate = useNavigate();

  return (
    <>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <div className="flex items-center gap-2 font-medium">
              <div className="flex h-12 items-center justify-center">
                <img src={OmifLogo} alt="Logo da Omif" className="h-10" />
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <form
                onSubmit={handleLoginSubmit}
                className={cn("flex flex-col gap-6")}
              >
                <FieldGroup>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Login</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                      Acesse sua conta para continuar.
                    </p>
                  </div>
                  <Field>
                    <AppInput
                      type="email"
                      placeholder="Digite seu e-mail"
                      label="E-mail"
                      register={register("email")}
                      error={errors.email?.message}
                    />
                  </Field>
                  <Field>
                    <AppInput
                      type="password"
                      placeholder="Digite sua senha"
                      label="Senha"
                      register={register("password")}
                      error={errors.password?.message}
                    />
                  </Field>
                  <Field>
                    <AppCaptcha
                      key={captchaResetKey}
                      onVerify={setCaptchaToken}
                      theme="light"
                      error={captchaError}
                    />
                  </Field>
                  <Field>
                    <AppButton
                      icon={<LogIn />}
                      type="submit"
                      isLoading={isSubmitting}
                    >
                      Entrar
                    </AppButton>
                  </Field>
                  <Field>
                    <FieldDescription className="flex w-full justify-between">
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          openPasswordRecoveryDialog();
                        }}
                        className="cursor-pointer underline underline-offset-4"
                      >
                        Esqueci minha senha
                      </a>
                      <a
                        onClick={() => navigate("/educador")}
                        className="cursor-pointer underline underline-offset-4"
                      >
                        Criar cadastro
                      </a>
                    </FieldDescription>
                    <FieldDescription className="text-center">
                      Problemas com o login:{" "}
                      <a href="#" className="underline underline-offset-4">
                        suporte@omif.com.br
                      </a>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </div>
          </div>
        </div>
        <div className="bg-muted relative hidden lg:block">
          <img
            src={OmifBackground}
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>

      {/* <AppDialog
        open={isPasswordRecoveryDialogOpen == true && openDialog === "dialogoPersonalizado"}
        onOpenChange={(open) => open || setOpenDialog(null)}
        onSubmit={() => {}}
      >
        <AppDialogTitle description="Descrição">Título</AppDialogTitle>
        <AppDialogContent>
          <AppInput label={"Input"}></AppInput>
          <AppInput label={"Input"}></AppInput>
          <AppInput label={"Input"}></AppInput>
          <AppInput label={"Input"}></AppInput>
          <AppInput label={"Input"}></AppInput>
        </AppDialogContent>
        <AppDialogFooter>
          <AppButton
            icon={<X />}
            variant="secondary"
            onClick={() => setOpenDialog(null)}
          >
            Cancelar
          </AppButton>
          <AppButton icon={<Save />} type="submit">
            Salvar
          </AppButton>
        </AppDialogFooter>
      </AppDialog> */}
    </>
  );
}

export { Login };

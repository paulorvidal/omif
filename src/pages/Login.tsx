import { useLogin } from "../hooks/useLogin";
import { A } from "../components/ui/A";
import { Button } from "../components/ui/Button";
import { H1 } from "../components/ui/H1";
import { Field } from "../components/ui/Field";
import { ProgressDialog } from "../components/ui/ProgressDialog";
import { EmailVerificationDialog } from "../components/ui/EmailVerificationDialog";
import { AccountApprovalDialog } from "../components/ui/AccountApprovalDialog";
import Captcha from "../components/ui/Captcha";
import { PasswordRecoveryDialog } from "../components/ui/PasswordRecoveryDialog";

export const Login = () => {
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
    maskedEmailForRecovery
  } = useLogin();

  return (
    <div className="flex h-screen w-screen flex-col items-center bg-zinc-200 p-4 text-zinc-700 sm:p-16">
      <div className="grid w-full max-w-4xl grid-cols-1 rounded-md bg-zinc-50 md:grid-cols-2">
        <div className="hidden rounded-s-md bg-green-600 md:block"></div>
        <form
          onSubmit={handleLoginSubmit}
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

          <Captcha
            key={captchaResetKey}
            onVerify={setCaptchaToken}
            theme="light"
            error={captchaError}
          />

          <Button type="submit">Entrar</Button>

          <div className="flex flex-col justify-center sm:flex-row sm:justify-between">
            <A
              type="button"
              onClick={(e) => {
                e.preventDefault();
                openPasswordRecoveryDialog();
              }}
              className="text-center"
            >
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

      <ProgressDialog open={isSubmitting} />

      <EmailVerificationDialog
        open={isVerificationDialogOpen}
        email={emailForVerification}
        isSending={isResending}
        onClose={closeVerificationDialog}
        onResend={handleResendVerificationLink}
        countdown={countdown}
      />
      <AccountApprovalDialog
        open={isApprovalDialogOpen}
        onClose={closeApprovalDialog}
      />

      <PasswordRecoveryDialog
        open={isPasswordRecoveryDialogOpen}
        onClose={closePasswordRecoveryDialog}
        onSubmit={handlePasswordRecoverySubmit}
        isSending={isSendingPasswordRecovery}
        maskedEmail={maskedEmailForRecovery} 
      />
    </div>
  );
};

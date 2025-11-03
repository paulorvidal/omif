import type { ComponentProps } from "react";
import {
  AppDialog,
  AppDialogContent,
  AppDialogFooter,
  AppDialogTitle,
} from "@/components/app-dialog";
import { Mail, MailCheck } from "lucide-react";
import { DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { AppButton } from "@/components/app-button";

type EmailVerificationDialogProps = {
  open: boolean;
  email: string;
  isSending: boolean;
  onClose: () => void;
  onResend: (email: string) => void;
  countdown: number;
} & ComponentProps<typeof AppDialog>;

export function EmailVerificationDialog({
  open,
  email,
  isSending,
  onClose,
  onResend,
  countdown,
}: EmailVerificationDialogProps) {
  const handleResendClick = () => {
    onResend(email);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <div className="flex justify-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <MailCheck className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <AppDialogTitle>Verifique seu E-mail</AppDialogTitle>
      <AppDialogContent>
        <DialogDescription className="text-center">
          Enviamos um link de confirmação para o e-mail:
        </DialogDescription>
        <p className="text-center font-bold text-green-600">{email}</p>
        <DialogDescription className="text-center">
          Por favor, verifique sua caixa de entrada e spam.
        </DialogDescription>
        {countdown > 0 && (
          <>
            <Separator orientation="horizontal" />
            <DialogDescription className="text-center">
              Você pode reenviar o link em:{" "}
              <span className="font-bold text-green-600">{countdown}s</span>
            </DialogDescription>
          </>
        )}
      </AppDialogContent>
      {!(countdown > 0) && (
        <AppDialogFooter>
          <AppButton
            icon={<Mail />}
            onClick={handleResendClick}
            isLoading={isSending}
          >
            Enviar Link
          </AppButton>
        </AppDialogFooter>
      )}
    </AppDialog>
  );
}

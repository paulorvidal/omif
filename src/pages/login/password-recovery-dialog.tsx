import { useEffect, type ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { AppGenericDialog } from "@/components/app-generic-dialog";
const recoverySchema = z.object({
  identifier: z.string().nonempty("O e-mail ou CPF é obrigatório"),
});
import { mask as remask } from "remask";
import {
  AppDialog,
  AppDialogContent,
  AppDialogFooter,
  AppDialogTitle,
} from "@/components/app-dialog";
import { KeyRound, Mail, X } from "lucide-react";
import { AppInput } from "@/components/app-input";
import { AppButton } from "@/components/app-button";
import { DialogDescription } from "@/components/ui/dialog";

type RecoveryFormData = z.infer<typeof recoverySchema>;

type PasswordRecoveryDialogProps = {
  open: boolean;
  isSending: boolean;
  onClose: () => void;
  onSubmit: (data: RecoveryFormData) => void;
  maskedEmail: string | null;
} & ComponentProps<typeof AppGenericDialog>;

function PasswordRecoveryDialog({
  open,
  isSending,
  onClose,
  onSubmit,
  maskedEmail,
}: PasswordRecoveryDialogProps) {
  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
    watch,
    setValue,
  } = useForm<RecoveryFormData>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      identifier: "",
    },
  });

  const identifierValue = watch("identifier");

  useEffect(() => {
    if (!identifierValue) return;

    if (/[a-zA-Z@]/.test(identifierValue)) {
      return;
    }

    const onlyDigits = identifierValue.replace(/\D/g, "");
    const maskedValue = remask(onlyDigits, ["999.999.999-99"]);

    if (maskedValue !== identifierValue) {
      setValue("identifier", maskedValue);
    }
  }, [identifierValue, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return maskedEmail ? (
    <AppDialog
      open={open}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <div className="flex justify-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <KeyRound className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <AppDialogTitle>Recuperar Senha</AppDialogTitle>
      <AppDialogContent>
        <DialogDescription className="text-center">
          Enviamos um link de recuperação para o e-mail:
        </DialogDescription>
        <p className="text-center font-bold text-green-600">{maskedEmail}</p>
        <DialogDescription className="text-center">
          Por favor, verifique sua caixa de entrada e spam.
        </DialogDescription>
      </AppDialogContent>
      <AppDialogFooter>
        <AppButton icon={<X />} onClick={handleClose}>
          Fechar
        </AppButton>
      </AppDialogFooter>
    </AppDialog>
  ) : (
    <AppDialog
      open={open}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex justify-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <KeyRound className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <AppDialogTitle description="Digite seu e-mail ou CPF para enviarmos um link de redefinição.">
        Recuperar Senha
      </AppDialogTitle>
      <AppDialogContent>
        <AppInput
          label="E-mail ou CPF:"
          type="text"
          placeholder="Digite aqui..."
          error={errors.identifier?.message}
          register={register("identifier")}
        />
      </AppDialogContent>
      <AppDialogFooter>
        <AppButton icon={<Mail />} type="submit" isLoading={isSending}>
          Enviar Link
        </AppButton>
      </AppDialogFooter>
    </AppDialog>
  );
}

export { PasswordRecoveryDialog };

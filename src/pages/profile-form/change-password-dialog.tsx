import { AppButton } from "@/components/app-button";
import {
  AppDialog,
  AppDialogContent,
  AppDialogFooter,
  AppDialogTitle,
} from "@/components/app-dialog";
import { AppInput } from "@/components/app-input";
import { DialogDescription } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Save, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "A senha atual é obrigatória."),
    newPassword: z
      .string()
      .min(8, "A nova senha deve ter no mínimo 8 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export type ChangePasswordDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: ChangePasswordFormData) => void;
  isSaving: boolean;
};

function ChangePasswordDialog({
  open,
  onClose,
  onSave,
  isSaving,
}: ChangePasswordDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const handleFormSubmit = (data: ChangePasswordFormData) => {
    onSave(data);
  };

  return (
    <AppDialog
      open={open}
      onSubmit={handleSubmit(handleFormSubmit)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <div className="flex justify-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <KeyRound className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <AppDialogTitle>Alterar Senha</AppDialogTitle>
      <AppDialogContent>
        <DialogDescription className="text-center">
          Para sua segurança, informe sua senha atual antes de definir uma nova.
        </DialogDescription>
        <AppInput
          type="password"
          placeholder="Digite sua senha atual"
          label="Senha Atual"
          register={register("currentPassword")}
          error={errors.currentPassword?.message}
        />
        <AppInput
          type="password"
          placeholder="Mínimo de 8 caracteres"
          label="Nova Senha"
          register={register("newPassword")}
          error={errors.newPassword?.message}
        />
        <AppInput
          type="password"
          placeholder="Repita a nova senha"
          label="Confirme a Nova Senha"
          register={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
      </AppDialogContent>
      <AppDialogFooter>
        <AppButton
          variant="secondary"
          type="button"
          onClick={onClose}
          disabled={isSaving}
          icon={<X />}
        >
          Cancelar
        </AppButton>
        <AppButton
          type="submit"
          disabled={isSaving}
          isLoading={isSaving}
          icon={<Save />}
        >
          Salvar Alterações
        </AppButton>
      </AppDialogFooter>
    </AppDialog>
  );
}

export { ChangePasswordDialog };

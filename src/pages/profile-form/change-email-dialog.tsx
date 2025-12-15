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
import { AtSign, Save, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const changeEmailSchema = z.object({
  email: z
    .string()
    .min(1, "O novo e-mail é obrigatório.")
    .email("Digite um e-mail válido."),
  password: z.string().min(1, "A senha atual é obrigatória."),
});

export type ChangeEmailFormData = z.infer<typeof changeEmailSchema>;

type ChangeEmailProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: ChangeEmailFormData) => void;
  isSaving: boolean;
  currentEmail?: string;
  initialValues?: Partial<ChangeEmailFormData>;
};

function ChangeEmailDialog({
  open,
  onClose,
  onSave,
  isSaving,
  currentEmail,
  initialValues,
}: ChangeEmailProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      email: initialValues?.email || "",
      password: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        email: initialValues?.email || "",
        password: "",
      });
    }
  }, [open, reset, initialValues]);

  const handleFormSubmit = (data: ChangeEmailFormData) => {
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
          <AtSign className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <AppDialogTitle>Alterar E-mail</AppDialogTitle>
      <AppDialogContent>
        <DialogDescription className="text-center">
          Seu e-mail atual é:{" "}
          <span className="font-bold text-green-600">{currentEmail}</span>. Para
          alterá-lo, digite o novo endereço e confirme com sua senha.
        </DialogDescription>
        <AppInput
          type="email"
          placeholder="Digite seu novo e-mail"
          label="Novo E-mail"
          register={register("email")}
          error={errors.email?.message}
        />
        <AppInput
          type="password"
          placeholder="Digite sua senha para confirmar"
          label="Senha Atual"
          register={register("password")}
          error={errors.password?.message}
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

export { ChangeEmailDialog };

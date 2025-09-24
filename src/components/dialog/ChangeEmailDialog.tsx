import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { AtSign, X } from "lucide-react";
import { Button } from "../Button";
import { Field } from "../Field";
import { PasswordField } from "../PasswordField";

const changeEmailSchema = z.object({
  email: z
    .string()
    .min(1, "O novo e-mail é obrigatório.")
    .email("Digite um e-mail válido."),
  password: z.string().min(1, "A senha atual é obrigatória."),
});

export type ChangeEmailFormData = z.infer<typeof changeEmailSchema>;

export interface ChangeEmailProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ChangeEmailFormData) => void;
  isSaving: boolean;
  currentEmail?: string;
}

export function ChangeEmailDialog(props: ChangeEmailProps) {
  const { open, onClose, onSave, isSaving, currentEmail } = props;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailSchema),
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const handleFormSubmit = (data: ChangeEmailFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent className="p-4">
        <div className="flex w-full justify-end">
          <IconButton
            aria-label="close"
            onClick={onClose}
            className="text-zinc-400 transition-colors hover:text-zinc-600"
            disabled={isSaving}
          >
            <X size={24} />
          </IconButton>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col items-center px-4 pb-6 text-center"
        >
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
            <AtSign className="h-8 w-8 text-zinc-600" strokeWidth={2} />
          </div>

          <h1 className="text-xl font-bold text-zinc-900">Alterar E-mail</h1>

          <p className="mt-2 max-w-xs text-sm text-zinc-500">
            Seu e-mail atual é{" "}
            <strong className="text-zinc-700">{currentEmail}</strong>. Para
            alterá-lo, digite o novo endereço e confirme com sua senha.
          </p>

          <div className="my-5 w-full space-y-4 text-left">
            <Field
              label="Novo E-mail:"
              type="email"
              placeholder="Digite seu novo e-mail"
              register={register("email")}
              error={errors.email?.message}
            />
            <PasswordField
              label="Senha Atual:"
              placeholder="Digite sua senha para confirmar"
              register={register("password")}
              error={errors.password?.message}
            />
          </div>

          <div className="flex w-full items-center justify-between gap-4">
            <Button
              secondary
              type="button"
              onClick={onClose}
              className="h-12 w-full text-base"
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="h-12 w-full text-base"
              disabled={isSaving}
              isLoading={isSaving}
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

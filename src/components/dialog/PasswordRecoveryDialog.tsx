import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mask as remask } from "remask";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { KeyRound, MailCheck, X } from "lucide-react";
import { Button } from "../Button";
import { Field } from "../Field";

const recoverySchema = z.object({
  identifier: z.string().nonempty("O e-mail ou CPF é obrigatório"),
});

type RecoveryFormData = z.infer<typeof recoverySchema>;

interface PasswordRecoveryDialogProps {
  open: boolean;
  isSending: boolean;
  onClose: () => void;
  onSubmit: (data: RecoveryFormData) => void;
  maskedEmail: string | null;
}

export function PasswordRecoveryDialog({
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

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogContent className="p-4">
        <div className="flex w-full justify-end">
          <IconButton
            aria-label="close"
            onClick={handleClose}
            className="text-zinc-400 transition-colors hover:text-zinc-600"
          >
            <X size={24} />
          </IconButton>
        </div>

        {maskedEmail ? (
          <div className="flex flex-col items-center px-4 pb-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <MailCheck className="h-8 w-8 text-green-600" strokeWidth={2} />
            </div>
            <h1 className="text-xl font-bold text-zinc-900">Link Enviado!</h1>
            <p className="mt-2 max-w-xs text-sm text-zinc-500">
              Enviamos um link de recuperação para o e-mail:
            </p>
            <p className="mt-2 text-base font-semibold text-zinc-800">
              {maskedEmail}
            </p>
            <p className="mt-2 max-w-xs text-sm text-zinc-500">
              Por favor, verifique sua caixa de entrada e spam.
            </p>
            <div className="mt-6 flex h-12 w-full items-center justify-center">
              <Button onClick={handleClose} className="h-12 w-full text-base">
                Fechar
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center px-4 pb-6 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <KeyRound className="h-8 w-8 text-green-600" strokeWidth={2} />
              </div>
              <h1 className="text-xl font-bold text-zinc-900">
                Recuperar Senha
              </h1>
              <p className="mt-2 max-w-xs text-sm text-zinc-500">
                Digite seu e-mail ou CPF para enviarmos um link de redefinição.
              </p>
              <div className="my-6 w-full text-left">
                <Field
                  label="E-mail ou CPF:"
                  type="text"
                  placeholder="Digite aqui..."
                  error={errors.identifier?.message}
                  register={register("identifier")}
                />
              </div>
              <div className="flex h-12 w-full items-center justify-center">
                <Button
                  type="submit"
                  disabled={isSending}
                  className="h-12 w-full text-base"
                >
                  {isSending ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Enviar Link"
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

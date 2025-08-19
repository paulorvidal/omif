import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { KeyRound, Loader2, X } from "lucide-react";
import { Button } from "./Button";
import { PasswordField } from "./PasswordField";

const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, "A senha atual é obrigatória."),
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

export interface ChangePasswordDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: ChangePasswordFormData) => void;
    isSaving: boolean;
}

export function ChangePasswordDialog(props: ChangePasswordDialogProps) {
    const { open, onClose, onSave, isSaving } = props;

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
                        <KeyRound className="h-8 w-8 text-zinc-600" strokeWidth={2} />
                    </div>

                    <h1 className="text-xl font-bold text-zinc-900">Alterar Senha</h1>

                    <p className="mt-2 max-w-xs text-sm text-zinc-500">
                        Para sua segurança, informe sua senha atual antes de definir uma
                        nova.
                    </p>

                    <div className="my-5 w-full space-y-4 text-left">
                        <PasswordField
                            label="Senha Atual:"
                            placeholder="Digite sua senha atual"
                            register={register("currentPassword")}
                            error={errors.currentPassword?.message}
                        />
                        <PasswordField
                            label="Nova Senha:"
                            placeholder="Mínimo de 8 caracteres"
                            register={register("newPassword")}
                            error={errors.newPassword?.message}
                        />
                        <PasswordField
                            label="Confirme a Nova Senha:"
                            placeholder="Repita a nova senha"
                            register={register("confirmPassword")}
                            error={errors.confirmPassword?.message}
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
                        >
                            {isSaving ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                "Salvar Alterações"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
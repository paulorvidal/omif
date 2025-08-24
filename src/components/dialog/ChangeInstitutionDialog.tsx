import { useEffect } from "react";
import { useForm } from "react-hook-form"; 
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { AlertTriangle, Building2, Loader2, X } from "lucide-react"; 
import { Button } from "../ui/Button";
import { AsyncSelectField } from "../ui/AsyncSelectField";

const changeInstitutionSchema = z.object({
    institution: z
        .object(
            {
                value: z.string(),
                label: z.string(),
            },
            { required_error: "A seleção da instituição é obrigatória." }
        )
        .nullable()
        .refine((val) => val !== null, "A seleção da instituição é obrigatória."),
});

export type ChangeInstitutionFormData = z.infer<typeof changeInstitutionSchema>;

export interface ChangeInstitutionDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: ChangeInstitutionFormData) => void;
    isSaving: boolean;
    currentInstitutionName?: string;
    loadOptions: (inputValue: string) => Promise<{ value: string; label: string }[]>;
}

export function ChangeInstitutionDialog(props: ChangeInstitutionDialogProps) {
    const {
        open,
        onClose,
        onSave,
        isSaving,
        currentInstitutionName,
        loadOptions,
    } = props;

    const {
        handleSubmit,
        control,
        reset,
        watch, 
        formState: { errors },
    } = useForm({
        resolver: zodResolver(changeInstitutionSchema),
        defaultValues: {
            institution: null,
        },
    });

    const selectedInstitution = watch("institution");

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const handleFormSubmit = (data: ChangeInstitutionFormData) => {
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
                        <Building2 className="h-8 w-8 text-zinc-600" strokeWidth={2} />
                    </div>

                    <h1 className="text-xl font-bold text-zinc-900">
                        Alterar Instituição
                    </h1>

                    <p className="mt-2 max-w-xs text-sm text-zinc-500">
                        Sua instituição atual é{" "}
                        <strong className="text-zinc-700">{currentInstitutionName}</strong>.
                        Para alterá-la, selecione a nova instituição abaixo.
                    </p>

                    <div className="my-5 w-full space-y-4 text-left">
                        <AsyncSelectField
                            name="institution"
                            label="Nova Instituição:"
                            placeholder="Digite para buscar..."
                            control={control}
                            loadOptions={loadOptions}
                            error={errors.institution?.message}
                        />
                    </div>

                    {selectedInstitution && (
                        <div
                            className="mb-5 flex w-full items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-left"
                            role="alert"
                        >
                            <AlertTriangle
                                className="h-5 w-5 flex-shrink-0 text-amber-500"
                                aria-hidden="true"
                            />
                            <div className="text-sm text-amber-800">
                                <span className="font-semibold">Atenção:</span> Ao confirmar a
                                alteração, seu acesso precisará ser validado novamente por um
                                coordenador ou administrador da nova instituição.
                            </div>
                        </div>
                    )}

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
                                "Salvar Alteração"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
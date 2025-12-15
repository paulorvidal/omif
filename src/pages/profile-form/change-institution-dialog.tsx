import { AppAsyncSelect } from "@/components/app-async-select";
import { AppButton } from "@/components/app-button";
import {
  AppDialog,
  AppDialogContent,
  AppDialogFooter,
  AppDialogTitle,
} from "@/components/app-dialog";
import { DialogDescription } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Save, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const changeInstitutionSchema = z.object({
  institution: z
    .string({ required_error: "A seleção da instituição é obrigatória." })
    .min(1, "A seleção da instituição é obrigatória."),
});

export type ChangeInstitutionFormData = z.infer<typeof changeInstitutionSchema>;

export type ChangeInstitutionDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: ChangeInstitutionFormData) => void;
  isSaving: boolean;
  currentInstitutionName?: string;
  institutionOptions?: { value: string | number; label: string }[];
  isLoading?: boolean;
  onInputChange?: (inputValue: string) => void;
};

function ChangeInstitutionDialog({
  open,
  onClose,
  onSave,
  isSaving,
  currentInstitutionName,
  institutionOptions = [],
  isLoading = false,
  onInputChange,
}: ChangeInstitutionDialogProps) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changeInstitutionSchema),
    defaultValues: {
      institution: "",
    },
  });

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const handleFormSubmit = (data: ChangeInstitutionFormData) => {
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
          <Building2 className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <AppDialogTitle>Alterar Instituição</AppDialogTitle>
      <AppDialogContent>
        <DialogDescription className="text-center">
          Sua instituição atual é:{" "}
          <span className="font-bold text-green-600">
            {currentInstitutionName}
          </span>
          . Para alterá-la, selecione a nova instituição abaixo.
        </DialogDescription>
        <AppAsyncSelect
          name="institution"
          label="Nova Instituição:"
          placeholder="Digite para buscar..."
          control={control}
          options={institutionOptions}
          isLoading={isLoading}
          onInputChange={onInputChange}
          error={errors.institution?.message}
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

export { ChangeInstitutionDialog };

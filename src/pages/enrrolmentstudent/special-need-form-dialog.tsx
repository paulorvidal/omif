import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SpecialNeedSchema,
  type SpecialNeedFormData,
} from "../../hooks/use-enrollment-student-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
} from "@/components/ui/field"; 
import { AppInput } from "@/components/app-input";
import { AppSelect } from "@/components/app-select";
import { AppButton } from "@/components/app-button";
import { Save } from "lucide-react";

const specialNeedTypeOptions = [
  { label: "Visual", value: "visual" },
  { label: "Auditiva", value: "auditiva" },
  { label: "Motora", value: "motora" },
  { label: "Intelectual", value: "intelectual" },
  { label: "Outra", value: "outra" },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SpecialNeedFormData) => void;
  defaultValues?: SpecialNeedFormData;
};

const emptyValues: SpecialNeedFormData = {
  description: "",
  type: "",
  observation: "",
  medicalReportFile: new DataTransfer().files, 
};

export function SpecialNeedFormModal({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<SpecialNeedFormData>({
    resolver: zodResolver(SpecialNeedSchema),
    defaultValues: defaultValues || emptyValues,
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues || emptyValues);
    }
  }, [isOpen, defaultValues, reset]);

  const handleFormSubmit = (data: SpecialNeedFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Editar" : "Adicionar"} Necessidade Especial
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
          <FieldGroup className="mt-4">
            <Field>
              <AppInput
                label="Descrição da Necessidade"
                placeholder="Ex: Dislexia, Baixa Visão"
                {...register("description")}
                error={errors.description?.message}
              />
            </Field>
            <Field>
              <AppSelect
                name="type"
                label="Tipo de Necessidade"
                control={control as any}
                options={specialNeedTypeOptions}
                error={errors.type?.message}
              />
            </Field>
            <Field>
              <AppInput
                label="Observação (Opcional)"
                placeholder="Ex: Necessita de prova ampliada, ledor, etc."
                {...register("observation")}
                error={errors.observation?.message}
              />
            </Field>
            <Field>
              <AppInput
                label="Laudo Médico"
                type="file"
                accept="application/pdf,image/*"
                {...register("medicalReportFile")}
                error={errors.medicalReportFile?.message}
                helpText="Arquivo (PDF, PNG, JPG) de até 5MB. Obrigatório."
              />
            </Field>

            <DialogFooter className="mt-6 gap-2">
              <DialogClose asChild>
                <AppButton type="button" variant="secondary">
                  Cancelar
                </AppButton>
              </DialogClose>
              <AppButton type="submit" icon={<Save />}>
                Salvar
              </AppButton>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
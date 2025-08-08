// src/hooks/useStepsForm.ts

import { useEffect, useState } from "react";
import { useForm, FieldName } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";

import { ApiError } from "../services/apiError";
import {
  createEdition,
  updateEdition,
  getEditionById,
} from "../services/editionService";
import type {
  CreateEditionRequest,
  UpdateEditionRequest,
  Edition,
} from "../types/editionTypes";
import { redirectTo, showToast } from "../utils/events";

// Schema Zod (sem alterações)
const EditionFormSchema = z.object({
    name: z.string().nonempty("O nome é obrigatório"),
    year: z.coerce.number().min(2000, "O ano deve ser válido"),
    minimumWage: z.string().nonempty("O salário mínimo é obrigatório"),
    startDate: z.string().nonempty("A data de início da vigência é obrigatória"),
    endDate: z.string().nonempty("A data de fim da vigência é obrigatória"),
    registrationStartDate: z.string().nonempty("A data de início das inscrições é obrigatória"),
    registrationEndDate: z.string().nonempty("A data de fim das inscrições é obrigatória")
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
    message: "O fim da vigência deve ser após o início.",
    path: ["endDate"],
}).refine(data => new Date(data.registrationEndDate) > new Date(data.registrationStartDate), {
    message: "O fim das inscrições deve ser após o início.",
    path: ["registrationEndDate"],
});

type FormData = z.infer<typeof EditionFormSchema>;

// Campos definidos para a estrutura de 2 ETAPAS
const stepFields: FieldName<FormData>[][] = [
  ["name", "year", "minimumWage", "startDate", "endDate"], // Etapa 1
  ["registrationStartDate", "registrationEndDate"],     // Etapa 2
];

type UseStepsFormProps = {
  editionId?: string;
};

export const useStepsForm = ({ editionId }: UseStepsFormProps) => {
  const isEditMode = Boolean(editionId);
  const [currentStep, setCurrentStep] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    trigger, // Essencial para validar cada etapa
  } = useForm<FormData>({ resolver: zodResolver(EditionFormSchema), defaultValues: { /* ... */ }});

  const { data: editionData, isLoading: isEditionLoading } = useQuery<Edition>({
    queryKey: ["edition", editionId],
    queryFn: () => getEditionById(editionId!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (editionData) {
        // Lógica para popular o form (reset) permanece a mesma
        // ...
    }
  }, [editionData, reset]);

  const { mutate, isPending } = useMutation({
    // Lógica de Create/Update permanece a mesma
    // ...
  });

  const handleFormSubmit = handleSubmit(async (data: FormData) => {
    // Lógica de submissão final permanece a mesma
    // ...
  });

  // Funções de navegação para as etapas
  const nextStep = async () => {
    const fields = stepFields[currentStep];
    const output = await trigger(fields, { shouldFocus: true });
    if (output) {
      setCurrentStep((prev) => Math.min(prev + 1, stepFields.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    reset();
    setCurrentStep(0);
  };

  return {
    errors,
    isEditMode,
    isPending,
    isEditionLoading,
    register,
    handleFormSubmit,
    handleReset,
    // Propriedades das etapas
    currentStep,
    totalSteps: stepFields.length,
    nextStep,
    prevStep,
    // Dados para o cabeçalho
    editionData,
  };
};
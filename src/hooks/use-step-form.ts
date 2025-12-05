import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { stepService } from "@/services/step-service";
import { ApiError } from "@/services/api-error";
import type { Step } from "@/types/step-types";

const stepFormSchema = z
  .object({
    number: z.number({ required_error: "Número da etapa é obrigatório" }),
    startDate: z
      .string({ required_error: "Data de início é obrigatória" })
      .min(1, "Data de início é obrigatória"),
    endDate: z
      .string({ required_error: "Data de término é obrigatória" })
      .min(1, "Data de término é obrigatória"),
    endDateForReleaseOfNote: z.string().optional().or(z.literal("")),
    cutOffScore: z
      .number({ invalid_type_error: "Nota de corte deve ser um número válido" })
      .min(0, "Nota de corte deve ser maior ou igual a 0")
      .max(100, "Nota de corte deve ser menor ou igual a 100")
      .optional(),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "Data de início deve ser anterior à data de término",
    path: ["endDate"],
  })
  .refine(
    (data) =>
      !data.endDateForReleaseOfNote ||
      data.endDateForReleaseOfNote === "" ||
      new Date(data.endDate) < new Date(data.endDateForReleaseOfNote),
    {
      message: "Data de liberação deve ser posterior à data de término",
      path: ["endDateForReleaseOfNote"],
    },
  )
  .refine(
    (data) => {
      if (data.number === 1) {
        return data.endDateForReleaseOfNote !== undefined && data.endDateForReleaseOfNote !== "";
      }
      return true;
    },
    {
      message: "Este campo é obrigatório",
      path: ["endDateForReleaseOfNote"],
    },
  )
  .refine(
    (data) => {
      if (data.number === 1) {
        return data.cutOffScore !== undefined;
      }
      return true;
    },
    {
      message: "Este campo é obrigatório",
      path: ["cutOffScore"],
    },
  );

type StepFormData = z.infer<typeof stepFormSchema>;

interface UseStepFormProps {
  editionId: string;
  step?: Step;
  existingSteps?: Step[];
  onSuccess?: () => void;
}

export function useStepForm({ editionId, step, existingSteps = [], onSuccess }: UseStepFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!step;

  const getNextStepNumber = () => {
    if (existingSteps.length === 0) return 1;
    const existingNumbers = existingSteps.map(s => s.number);
    if (!existingNumbers.includes(1)) return 1;
    if (!existingNumbers.includes(2)) return 2;
    return 1;
  };

  const form = useForm<StepFormData>({
    resolver: zodResolver(stepFormSchema),
    defaultValues: {
      number: 1,
      startDate: "",
      endDate: "",
      endDateForReleaseOfNote: undefined,
      cutOffScore: undefined,
    },
  });

  useEffect(() => {
    if (step) {
      form.reset({
        number: step.number,
        startDate: step.startDate.split("T")[0],
        endDate: step.endDate.split("T")[0],
        endDateForReleaseOfNote: step.endDateForReleaseOfNote
          ? step.endDateForReleaseOfNote.split("T")[0]
          : undefined,
        cutOffScore: step.cutOffScore ?? undefined,
      });
    } else {
      form.reset({
        number: getNextStepNumber(),
        startDate: "",
        endDate: "",
        endDateForReleaseOfNote: undefined,
        cutOffScore: undefined,
      });
    }
  }, [step, existingSteps]);

  const onSubmit = async (data: StepFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        number: data.number,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        endDateForReleaseOfNote: data.endDateForReleaseOfNote
          ? new Date(data.endDateForReleaseOfNote).toISOString()
          : undefined,
        cutOffScore: data.cutOffScore && !isNaN(data.cutOffScore) ? data.cutOffScore : undefined,
      };

      if (isEditing && step) {
        await stepService.updateStep(editionId, step.id, payload);
      } else {
        await stepService.createStep(editionId, payload);
      }

      onSuccess?.();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Erro ao salvar etapa");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    if (!step) return;

    setIsDeleting(true);
    setError(null);

    try {
      await stepService.deleteStep(editionId, step.id);
      onSuccess?.();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Erro ao deletar etapa");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    form,
    isLoading,
    isDeleting,
    error,
    isEditing,
    onSubmit: form.handleSubmit(onSubmit),
    onDelete,
  };
}

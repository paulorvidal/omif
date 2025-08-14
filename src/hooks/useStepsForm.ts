import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { getEditionWithSteps, saveStepsForEdition } from "../services/editionService";
import type { Step, CreateStepDTO } from "../types/stepsTypes";


const stepOneSchema = z.object({
  cutOffScore: z.coerce.number().min(0, "A nota não pode ser negativa.").nullable(),
  startDate: z.string().min(1, "A data de início é obrigatória."),
  endDate: z.string().min(1, "A data de encerramento é obrigatória."),
  endDateForReleaseOfNote: z.string().min(1, "A data de liberação da nota é obrigatória."),
})
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "A data de encerramento deve ser posterior à de início.",
    path: ["endDate"],
  })
  .refine((data) => new Date(data.endDateForReleaseOfNote) > new Date(data.endDate), {
    message: "A data da nota deve ser posterior ao encerramento.",
    path: ["endDateForReleaseOfNote"],
  });

const stepTwoSchema = z.object({
  startDate: z.string().min(1, "A data de início é obrigatória."),
  endDate: z.string().min(1, "A data de encerramento é obrigatória."),
})
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "A data de encerramento deve ser posterior à de início.",
    path: ["endDate"],
  });


export const stepsFormSchema = z.object({
  steps: z.tuple([stepOneSchema, stepTwoSchema]),
}).refine(
  (data) => {
    const step1EndDate = new Date(data.steps[0].endDate);
    const step1NoteReleaseDate = new Date(data.steps[0].endDateForReleaseOfNote);
    const step2StartDate = new Date(data.steps[1].startDate);

    return step2StartDate > step1EndDate && step2StartDate > step1NoteReleaseDate;
  },
  {
    message: "O início da Etapa 2 deve ocorrer após o fim e a liberação da nota da Etapa 1.",
    path: ["steps", 1, "startDate"],
  }
);

export type StepsFormData = z.infer<typeof stepsFormSchema>;

export const useStepsForm = (editionId?: string) => {
  const { data: editionData, isLoading, isError } = useQuery({
    queryKey: ["editionSteps", editionId],
    queryFn: () => getEditionWithSteps(editionId!),
    enabled: !!editionId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<StepsFormData>({
    resolver: zodResolver(stepsFormSchema),
    defaultValues: {
      steps: [
        { cutOffScore: 0, startDate: '', endDate: '', endDateForReleaseOfNote: '' },
        { startDate: '', endDate: '' },
      ],
    },
  });



  const formatDateForInput = (dateString?: string | Date) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return '';
    }

    const pad = (num: number) => num.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (editionData?.steps && editionData.steps.length >= 2) {
      const initialSteps: [Step, Step] = [editionData.steps[0], editionData.steps[1]];
      reset({
        steps: [
          {
            ...initialSteps[0],
            startDate: formatDateForInput(initialSteps[0].startDate),
            endDate: formatDateForInput(initialSteps[0].endDate),
            endDateForReleaseOfNote: formatDateForInput(initialSteps[0].endDateForReleaseOfNote),
          },
          {
            ...initialSteps[1],
            startDate: formatDateForInput(initialSteps[1].startDate),
            endDate: formatDateForInput(initialSteps[1].endDate),
          },
        ],
      });
    }
  }, [editionData, reset]);

  const queryClient = useQueryClient();
  const { mutate: saveMutation, isPending: isSaving } = useMutation({
    mutationFn: (createSteps: CreateStepDTO[]) => saveStepsForEdition(editionId!, createSteps),
    onSuccess: (savedData) => {
      console.log("Salvo com sucesso!");
      if (savedData?.steps && savedData.steps.length >= 2) {
        const stepsToReset: [Step, Step] = [savedData.steps[0], savedData.steps[1]];
        reset({ steps: stepsToReset });
      }
      queryClient.invalidateQueries({ queryKey: ["editionSteps", editionId] });
    },
    onError: (error) => {
      console.error("Falha ao salvar:", error);
    },
  });

  const onSubmit = (formData: StepsFormData) => {
    const createStepDTOs = [
      {
        number: 1,
        startDate: formData.steps[0].startDate,
        endDate: formData.steps[0].endDate,
        cutOffScore: formData.steps[0].cutOffScore,
        endDateForReleaseOfNote: formData.steps[0].endDateForReleaseOfNote
      },
      {
        number: 2,
        startDate: formData.steps[1].startDate,
        endDate: formData.steps[1].endDate,
        cutOffScore: null,
        endDateForReleaseOfNote: null
      }
    ];

    saveMutation(createStepDTOs);
  };
  const handleReset = () => reset();


  return {
    editionData, isLoading, isError, isSaving, isDirty,
    register, handleSubmit, onSubmit, errors, handleReset
  };
};


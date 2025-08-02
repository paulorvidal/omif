import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  createInstitution,
  updateInstitution,
  getInstitutionById,
  type CreateInstitutionRequest,
  type UpdateInstitutionRequest,
} from "../services/institutionService";
import { fetchEducators } from "../services/educatorService";
import { scrollToTop } from "../utils/scrollToTop";
import { redirectTo, showToast } from "../utils/events";
import { AxiosError } from "axios";

const InstitutionFormSchema = z.object({
  name: z.string().nonempty("O nome é obrigatório"),
  inep: z.string(),
  email1: z
    .string()
    .nonempty("Informe ao menos um e‑mail")
    .email("Email inválido"),
  email2: z.string().email("Email inválido").optional().or(z.literal("")),
  email3: z.string().email("Email inválido").optional().or(z.literal("")),
  phoneNumber: z
    .string()
    .nonempty("O telefone é obrigatório")
    .regex(
      /^\(\d{2}\)\d{4,5}-\d{4}$/,
      "Formato inválido. Use (XX)XXXX-XXXX ou (XX)XXXXX-XXXX",
    ),
  coordinator: z
    .object({ label: z.string(), value: z.string() })
    .nullable()
    .optional(),
});

type FormData = z.infer<typeof InstitutionFormSchema>;

type UseInstitutionFormProps = {
  institutionId?: string;
};

export const useInstitutionForm = ({
  institutionId,
}: UseInstitutionFormProps) => {
  const isEditMode = Boolean(institutionId);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(InstitutionFormSchema),
    defaultValues: {
      name: "",
      inep: "",
      email1: "",
      email2: "",
      email3: "",
      phoneNumber: "",
      coordinator: null,
    },
  });

  useEffect(() => {
    if (!isEditMode) return;
    (async () => {
      try {
        const institution = await getInstitutionById(institutionId!);
        reset({
          name: institution.name,
          inep: institution.inep ?? "",
          email1: institution.email1,
          email2: institution.email2 ?? "",
          email3: institution.email3 ?? "",
          phoneNumber: institution.phoneNumber,
          coordinator: institution.coordinator
            ? {
                label: institution.coordinator.socialName,
                value: institution.coordinator.id,
              }
            : null,
        });
      } catch {
        showToast("Não foi possível carregar a instituição", "error");
      }
    })();
  }, [isEditMode, institutionId, reset]);

  const handleFormSubmit = handleSubmit(async (data: FormData) => {
    if (isEditMode && !isDirty) {
      showToast("Nenhuma alteração para salvar", "info");
      return;
    }

    const basePayload: CreateInstitutionRequest = {
      name: data.name,
      inep: data.inep,
      phoneNumber: data.phoneNumber,
      email1: data.email1,
      email2: data.email2 || undefined,
      email3: data.email3 || undefined,
    };

    try {
      if (isEditMode) {
        await updateInstitution(institutionId!, {
          ...basePayload,
          coordinatorId: data.coordinator?.value,
        } as UpdateInstitutionRequest);
        showToast("Instituição atualizada com sucesso", "success");
      } else {
        await createInstitution(basePayload);
        showToast("Instituição criada com sucesso", "success");
      }
      redirectTo("/instituicoes");
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const message =
        axiosErr.response?.data?.message || axiosErr.message || "Erro";
      showToast(message, "error");
    }
  });

  const handleReset = () => {
    reset();
    scrollToTop();
  };

  const loadEducatorOptions = (inputValue: string) => {
    return fetchEducators(inputValue, institutionId!);
  };

  return {
    control,
    errors,
    isEditMode,
    isSubmitting,
    register,
    handleFormSubmit,
    handleReset,
    loadEducatorOptions,
  };
};

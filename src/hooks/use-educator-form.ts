/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  createEducator,
  updateEducator,
  getEducatorById,
} from "@/services/educator-service";
import { fetchInstitutions } from "@/services/institution-service";
import { scrollToTop } from "@/utils/scroll-to-top";
import { redirectTo, showToast } from "@/utils/events";
import { ApiError } from "@/services/api-error";
import type { CreateEducatorRequest } from "@/types/educator-types";
import { useDebounce } from "@/hooks/use-debounce";
import type { Institution } from "@/types/institution-types";
import type { PageResponse } from "@/types/default-types";
import { formatCPF, formatPhone, unmask } from "@/utils/formatters";

const createSchema = (isEditMode: boolean) =>
  z
    .object({
      name: z.string().min(2, "O nome é obrigatório."),
      socialName: z.string().optional(),
      cpf: z
        .string()
        .min(1, "O CPF é obrigatório")
        .regex(
          /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/,
          "O CPF deve estar no formato 000.000.000-00.",
        ),
      phoneNumber: z
        .string()
        .min(1, "O telefone é obrigatório")
        .regex(
          /^\(\d{2}\)(9\d{4}|\d{4})-\d{4}$/,
          "Formato inválido: (XX)9XXXX-XXXX ou (XX)XXXX-XXXX.",
        ),
      dateOfBirth: z.string().min(1, "Data de nascimento obrigatória."),
      siape: z.string().min(1, "SIAPE obrigatório."),

      email: isEditMode
        ? z.string().optional()
        : z.string().email("E-mail inválido."),
      confirmEmail: isEditMode ? z.string().optional() : z.string(),
      password: isEditMode
        ? z.string().optional()
        : z.string().min(6, "Mínimo 6 caracteres."),
      confirmPassword: isEditMode ? z.string().optional() : z.string(),
      institution: isEditMode
        ? z.string().optional()
        : z.string().uuid("Selecione uma instituição."),
      captchaToken: isEditMode
        ? z.string().optional()
        : z.string().min(1, "Valide o captcha."),
    })
    .refine((data) => isEditMode || data.password === data.confirmPassword, {
      message: "As senhas não coincidem",
      path: ["confirmPassword"],
    })
    .refine((data) => isEditMode || data.email === data.confirmEmail, {
      message: "Os e-mails não coincidem",
      path: ["confirmEmail"],
    });

export type EducatorFormData = z.infer<ReturnType<typeof createSchema>>;

export const useEducatorForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  const [institutionInput, setInstitutionInput] = useState("");
  const debouncedInstitutionInput = useDebounce(institutionInput, 500);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<EducatorFormData>({
    resolver: zodResolver(createSchema(isEditMode)),
    defaultValues: {
      name: "",
      socialName: "",
      cpf: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
      siape: "",
      institution: "",
      phoneNumber: "",
      dateOfBirth: "",
      captchaToken: "",
    },
  });

  const { isLoading: isLoadingData } = useQuery({
    queryKey: ["educator", id],
    queryFn: () => getEducatorById(id!),
    enabled: isEditMode,
    retry: false,
  });

  useEffect(() => {
    if (isEditMode && id) {
      getEducatorById(id)
        .then((data) => {
          reset({
            name: data.name,
            socialName: data.socialName || "",
            cpf: formatCPF(data.cpf),
            phoneNumber: formatPhone(data.phoneNumber),
            siape: data.siape,
            dateOfBirth: data.dateOfBirth,
            email: data.email,
            confirmEmail: data.email,
            institution: data.institution?.id,
          });
        })
        .catch(() => {
          showToast("Erro ao carregar dados.", "error");
        });
    }
  }, [id, isEditMode, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditMode && id) {
        return updateEducator(id, data);
      }
      return createEducator(data);
    },
    onSuccess: (response) => {
      showToast(
        response.message ||
          (isEditMode ? "Atualizado com sucesso!" : "Cadastrado com sucesso!"),
        "success",
      );
      if (!isEditMode) {
        reset();
        redirectTo("/login");
      } else {
        scrollToTop();
      }
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showToast(error.message, "error");
      } else {
        showToast("Erro inesperado.", "error");
      }
    },
  });

  const { data: institutionOptions, isLoading: isInstitutionsLoading } =
    useQuery({
      queryKey: ["institutions", debouncedInstitutionInput],
      queryFn: () =>
        fetchInstitutions({ q: debouncedInstitutionInput, page: 0, size: 20 }),
      select: (data: PageResponse<Institution>) =>
        data.content.map((inst) => ({ label: inst.name, value: inst.id })),
      enabled: !isEditMode,
    });

  const onSubmit = (data: EducatorFormData) => {
    const cleanString = (val: string | undefined) =>
      val?.trim().replace(/\s+/g, " ") || "";
    const basePayload = {
      name: cleanString(data.name),
      socialName: cleanString(data.socialName),
      dateOfBirth: data.dateOfBirth,
      phoneNumber: data.phoneNumber,
      cpf: data.cpf,
      siape: unmask(data.siape),
    };

    if (isEditMode) {
      mutation.mutate(basePayload);
    } else {
      const createPayload: CreateEducatorRequest = {
        ...basePayload,
        email: cleanString(data.email).toLowerCase(),
        password: data.password || "",
        institutionId: data.institution || "",
        captchaToken: data.captchaToken || "",
      };

      mutation.mutate(createPayload);
    }
  };

  return {
    register,
    control,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    handleReset: () => reset(),
    isPending: mutation.isPending,
    institutionOptions: institutionOptions ?? [],
    isInstitutionsLoading,
    setInstitutionInput,
    isEditMode,
    isLoadingData,
  };
};

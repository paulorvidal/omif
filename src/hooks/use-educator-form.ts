import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createEducator } from "../services/educator-service";
import { scrollToTop } from "../utils/scroll-to-top";
import { redirectTo, showToast } from "../utils/events";
import { ApiError } from "../services/api-error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateEducatorRequest } from "../types/educator-types";
import { fetchInstitutions } from "../services/institution-service";
import { useDebounce } from "./use-debounce";
import type { Institution } from "../types/institution-types";
import type { PageResponse } from "../types/default-types";

const EducatorFormSchema = z
  .object({
    name: z
      .string()
      .nonempty("O nome é obrigatório.")
      .min(2, "O nome deve ter no mínimo 2 caracteres.")
      .max(255, "O nome deve ter no máximo 255 caracteres."),
    socialName: z
      .string()
      .max(255, "O nome social deve ter no máximo 255 caracteres.")
      .optional(),
    email: z
      .string()
      .nonempty("O e-mail é obrigatório.")
      .email("Informe um e-mail válido."),
    confirmEmail: z.string(),
    cpf: z
      .string()
      .nonempty("O CPF é obrigatório")
      .regex(
        /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/,
        "O CPF deve estar no formato XXX.XXX.XXX-XX.",
      ),
    password: z
      .string()
      .nonempty("A senha é obrigatória.")
      .min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
    siape: z.string().nonempty("O SIAPE é obrigatório."),
    institution: z
      .object({
        label: z.string(),
        value: z.string().uuid("ID da instituição inválido"),
      })
      .nullable()
      .superRefine((data, ctx) => {
        if (data === null || data.value === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A instituição deve ser informada.",
          });
        }
      }),
    phoneNumber: z
      .string()
      .nonempty("O telefone é obrigatório")
      .regex(
        /^\(\d{2}\)\s?9?\d{4}-\d{4}$/,
        "O número deve estar no formato (XX)9XXXX-XXXX ou (XX)XXXX-XXXX.",
      ),
    dateOfBirth: z
      .string()
      .nonempty("A data de nascimento é obrigatória.")
      .refine((v) => !isNaN(Date.parse(v)), "Data inválida.")
      .refine(
        (v) => new Date(v) <= new Date(),
        "A data de nascimento não pode ser no futuro.",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Os e-mails não coincidem",
    path: ["confirmEmail"],
  });

export type EducatorFormData = z.infer<typeof EducatorFormSchema>;

export const useEducatorForm = () => {
  const queryClient = useQueryClient();
  const [institutionInput, setInstitutionInput] = useState("");
  const debouncedInstitutionInput = useDebounce(institutionInput, 500);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<EducatorFormData>({
    resolver: zodResolver(EducatorFormSchema),
    defaultValues: {
      name: "",
      socialName: "",
      cpf: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
      siape: "",
      institution: null,
      phoneNumber: "",
      dateOfBirth: "",
    },
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const resetCaptcha = () => {
    setCaptchaToken(null);
    setCaptchaResetKey((prevKey) => prevKey + 1);
  };

  const handleVerifyCaptcha = (token: string) => {
    setCaptchaToken(token);
    if (token) {
      setCaptchaError(null);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createEducator,
    onSuccess: (response) => {
      showToast(
        response.message || "Educador cadastrado com sucesso!",
        "success",
      );
      redirectTo("/login");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showToast(error.message, "error");
      } else {
        console.error("Erro não capturado pela API:", error);
        showToast("Ocorreu um erro inesperado.", "error");
      }
    },
    onSettled: () => {
      resetCaptcha();
    },
  });

  const { data: institutionOptions, isLoading: isInstitutionsLoading } =
    useQuery({
      queryKey: ["institutions", debouncedInstitutionInput],

      queryFn: () =>
        fetchInstitutions({
          q: debouncedInstitutionInput,
          page: 0,
          size: 10,
        }),

      select: (data: PageResponse<Institution>) =>
        data.content.map((institution) => ({
          label: institution.name,
          value: institution.id,
        })),
    });

  const onSubmit = (data: Omit<EducatorFormData, "captchaToken">) => {
    if (!captchaToken) {
      setCaptchaError("Por favor, complete a verificação.");
      return;
    }

    const { institution, ...formData } = data;

    if (!institution) {
      return;
    }

    const payload: CreateEducatorRequest = {
      ...formData,
      socialName: formData.socialName || "",
      institutionId: institution.value,
      captchaToken,
    };

    mutate(payload);
  };

  const onReset = () => {
    reset();
    resetCaptcha();
    scrollToTop();
  };

  return {
    register,
    control,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    handleReset: onReset,
    isPending,
    setCaptchaToken: handleVerifyCaptcha,
    captchaToken,
    captchaResetKey,
    captchaError,
    institutionOptions: institutionOptions ?? [],
    isInstitutionsLoading,
    setInstitutionInput,
  };
};

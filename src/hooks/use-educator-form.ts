/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { CreateEducatorRequest } from "../types/educator-types";
import { fetchInstitutions } from "../services/institution-service";
import { useDebounce } from "./use-debounce";
import { createEducator } from "../services/educator-service";
import { scrollToTop } from "../utils/scroll-to-top";
import { redirectTo, showToast } from "../utils/events";
import { ApiError } from "../services/api-error";
import { formatBrazilianDateToISO } from "../utils/format-date";

export const EducatorFormSchema = z
  .object({
    name: z.string().nonempty("O nome é obrigatório.").min(2).max(255),
    socialName: z.string().max(255).optional(),
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
      .refine((data) => data !== null, {
        message: "A instituição deve ser informada.",
      })
      .refine((data) => data?.value !== "", {
        message: "A instituição deve ser informada.",
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
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Formato de data inválido (DD/MM/AAAA)")
      .refine((v) => {
        const parts = v.split("/");
        const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        return date instanceof Date && !isNaN(date.getTime());
      }, "Data inválida.")
      .refine((v) => {
        const parts = v.split("/");
        const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        return date <= new Date();
      }, "A data de nascimento não pode ser no futuro."),

    captchaToken: z.string().optional().or(z.literal("")),
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
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EducatorFormData>({
    resolver: zodResolver(EducatorFormSchema) as any,
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
      captchaToken: undefined,
    } as any,
  });

  const [institutionInput, setInstitutionInput] = useState("");
  const [debouncedInstitutionInput] = useDebounce(institutionInput, 500);

  const { data: institutionsResponse, isLoading: isInstitutionsLoading } =
    useQuery({
      queryKey: ["institutions", debouncedInstitutionInput],
      queryFn: () =>
        fetchInstitutions({
          q: debouncedInstitutionInput,
          page: 0,
          size: 20,
        }),
    });

  const institutionOptions = useMemo(() => {
    return (
      institutionsResponse?.content.map((inst) => ({
        label: inst.acronym ? `${inst.acronym} - ${inst.name}` : inst.name,
        value: inst.id,
      })) ?? []
    );
  }, [institutionsResponse]);

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const resetCaptcha = () => {
    setCaptchaToken(null);
    setCaptchaError(null);
    setCaptchaResetKey((prevKey) => prevKey + 1);
    setValue("captchaToken", undefined, { shouldValidate: true });
  };

  const handleVerifyCaptcha = (token: string) => {
    setCaptchaToken(token);
    if (token) {
      setValue("captchaToken", token, { shouldValidate: true });
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

  const onSubmit: SubmitHandler<EducatorFormData> = (data) => {
    if (!data.captchaToken) {
      setCaptchaError("Por favor, complete a verificação.");
      return;
    }

    const {
      institution,
      confirmEmail,
      confirmPassword,
      captchaToken,
      dateOfBirth,
      ...formData
    } = data;

    if (!institution) {
      return;
    }

    const payload: CreateEducatorRequest = {
      ...formData,
      socialName: formData.socialName || "",
      institutionId: institution.value,
      captchaToken,

      dateOfBirth: formatBrazilianDateToISO(dateOfBirth),
      siape: formData.siape.replace(/\D/g, ""),
      phoneNumber: formData.phoneNumber.replace(" ", ""),
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
    setValue,
    handleSubmit: handleSubmit(onSubmit) as any,
    handleReset: onReset,
    isPending,
    setCaptchaToken: handleVerifyCaptcha,
    captchaToken,
    captchaResetKey,
    captchaError,
    institutionOptions,
    isInstitutionsLoading,
    setInstitutionInput,
  };
};

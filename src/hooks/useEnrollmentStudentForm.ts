import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { showToast } from "../utils/events";
import { ApiError } from "../services/apiError";
import { scrollToTop } from "../utils/scrollToTop";
import { fetchInstitutions } from "../services/enrollmentInstitutionService";
import { useDebounce } from "./useDebounce";

import type {
  CreateStudentRequest,
} from "../types/enrollmentStudentTypes";
import { createStudentAndEnrollmentInEdition } from "../services/enrollmentStudentService";

const StudentFormSchema = z.object({
  name: z.string().nonempty("O nome é obrigatório"),
  email: z.string().email("Email inválido"),
  cpf: z
    .string()
    .nonempty("O CPF é obrigatório")
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Formato de CPF inválido"),
  birthDate: z
    .string()
    .refine((v) => new Date(v) <= new Date(), "Data não pode ser no futuro"),
  socialName: z.string().optional(),
  bolsaFamilia: z.string().nonempty("Esse campo é obrigatório"),
  grade: z.coerce
    .number()
    .min(1, "Selecione uma série")
    .max(4, "Selecione uma série"),
  ethnicity: z.string().nonempty("Esse campo é obrigatório"),
  gender: z.string().nonempty("Esse campo é obrigatório"),
  completionElementarySchoolCategory: z
    .string()
    .nonempty("Esse campo é obrigatório"),
  incomeRange: z.string().nonempty("Esse campo é obrigatório"),
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
});

export type StudentFormData = z.infer<typeof StudentFormSchema>;



export const useEnrollmentStudentForm = (editionYear: number) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<StudentFormData>({
    resolver: zodResolver(StudentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      cpf: "",
      birthDate: "",
      socialName: "",
      bolsaFamilia: "",
      grade: 0,
      ethnicity: "",
      gender: "",
      completionElementarySchoolCategory: "",
      incomeRange: "",
      institution: null,
    },
  });

  const [institutionInput, setInstitutionInput] = useState("");
  const debouncedInstitutionInput = useDebounce(institutionInput, 500);


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
    mutationFn: (studentData: CreateStudentRequest) =>
      createStudentAndEnrollmentInEdition(studentData, editionYear),
    onSuccess: () => {
      reset(); 
      showToast(
        "Inscrição realizada com sucesso!",
        "success",
      );
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showToast(error.message, "error");
      } else {
        console.error("Erro não capturado pela API:", error);
        showToast(error.message || "Ocorreu um erro inesperado.", "error");
      }
    },
    onSettled: () => {
      resetCaptcha();
    },
  });


  const onSubmit = (data: Omit<StudentFormData, "captchaToken">) => {
    if (!captchaToken) {
      setCaptchaError("Por favor, complete a verificação.");
      return;
    }

    const { institution, ...formData } = data;

    if (!institution) {
      return;
    }

    const payload: CreateStudentRequest = {
      ...formData,
      socialName: formData.socialName || "",
      institutionId: institution.value,
      captchaToken,
    };

    mutate(payload);
  };

  const {
    data: institutionOptions,
    isLoading: isInstitutionsLoading,
  } = useQuery({
    queryKey: ["institutions", debouncedInstitutionInput, editionYear],
    queryFn: () =>
      fetchInstitutions(debouncedInstitutionInput, String(editionYear)),

    placeholderData: (previousData) => previousData,
  });

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
    institutionOptions: institutionOptions || [],
    isInstitutionsLoading,
    setInstitutionInput
  };
};

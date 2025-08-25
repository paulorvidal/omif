import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  createStudent,
  type CreateStudentRequest,
} from "../services/studentService";
import { showToast } from "../utils/events";
import { ApiError } from "../services/apiError";
import { scrollToTop } from "../utils/scrollToTop";

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

const bolsaFamiliaOptions = [
  { label: "Selecione uma opção", value: "" },
  { label: "Sim", value: "Sim" },
  { label: "Não", value: "Não" },
  { label: "Prefiro não responder", value: "Prefiro não responder" },
];

const gradeOptions = [
  { label: "Selecione a série", value: "" },
  { label: "1º ano", value: 1 },
  { label: "2º ano", value: 2 },
  { label: "3º ano", value: 3 },
];

const ethnicityOptions = [
  { label: "Selecione uma opção", value: "" },
  { label: "Branco", value: "Branco" },
  { label: "Pardo", value: "Pardo" },
  { label: "Preto", value: "Preto" },
  { label: "Amarelo", value: "Amarelo" },
  { label: "Indígena", value: "Indigena" },
  { label: "Prefiro não responder", value: "Prefiro não responder" },
];

const genderOptions = [
  { label: "Selecione uma opção", value: "" },
  { label: "Feminino", value: "Feminino" },
  { label: "Masculino", value: "Masculino" },
  { label: "Outro", value: "Outro" },
  { label: "Prefiro não responder", value: "Prefiro não responder" },
];

const completionElementarySchoolCategoryOptions = [
  { label: "Selecione uma opção", value: "" },
  { label: "Escola pública municipal", value: "Escola pública municipal" },
  { label: "Escola pública estadual", value: "Escola pública estadual" },
  { label: "Escola particular", value: "Escola particular" },
  {
    label: "Parte em escola pública parte em escola particular",
    value: "Parte em escola pública parte em escola particular",
  },
  { label: "Supletivo", value: "Supletivo" },
  { label: "Prefiro não responder", value: "Prefiro não responder" },
];

const incomeRangeOptions = [
  { label: "Selecione uma opção", value: "" },
  { label: "Até meio salário mínimo", value: "Até meio salário mínimo" },
  {
    label: "De meio a um salário mínimo",
    value: "De meio a um salário mínimo",
  },
  {
    label: "De um a dois salários mínimos",
    value: "De um a dois salários mínimos",
  },
  {
    label: "De dois a três salários mínimos",
    value: "De dois a três salários mínimos",
  },
  {
    label: "Acima de três salários mínimos",
    value: "Acima de três salários mínimos",
  },
  { label: "Prefiro não responder", value: "Prefiro não responder" },
];

export const useStudentForm = () => {
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
    mutationFn: createStudent,
    onSuccess: (response) => {
      showToast(
        response.message || "Estudante cadastrado com sucesso!",
        "success",
      );
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

  const onReset = () => {
    reset();
    resetCaptcha();
    scrollToTop();
  };

  return {
    bolsaFamiliaOptions,
    gradeOptions,
    ethnicityOptions,
    genderOptions,
    completionElementarySchoolCategoryOptions,
    incomeRangeOptions,
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
  };
};

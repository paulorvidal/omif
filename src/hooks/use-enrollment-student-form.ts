import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { showToast } from "../utils/events";
import { ApiError } from "../services/api-error";
import { scrollToTop } from "../utils/scroll-to-top";
import { fetchInstitutions } from "../services/enrollment-institution-service";
import { useDebounce } from "./use-debounce";
import { createStudentAndEnrollmentInEdition } from "../services/enrollment-student-service";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export type SpecialNeedFormData = z.infer<typeof SpecialNeedSchema>;

export const SpecialNeedSchema = z.object({
  description: z.string().nonempty("A descrição da necessidade é obrigatória."),
  type: z.string().nonempty("O tipo de necessidade é obrigatório."),
  observation: z.string().optional(),
  medicalReportFile: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, "O laudo médico é obrigatório.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `O arquivo deve ter no máximo ${MAX_FILE_SIZE_MB}MB.`
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Tipo de arquivo inválido. (Aceitos: PDF, JPEG, PNG, WEBP)"
    ),
});

const StudentFormSchema = z.object({
  name: z.string().nonempty("O nome é obrigatório"),
  email: z.string().email("Email inválido"),
  cpf: z
    .string()
    .nonempty("O CPF é obrigatório")
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Formato de CPF inválido"),
  birthDate: z
    .string()
    .nonempty("A data de nascimento é obrigatória")
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
    .string({ required_error: "A instituição deve ser informada." })
    .uuid("ID da instituição inválido"),

  captchaToken: z
    .string()
    .nonempty("Por favor, valide o captcha."),

  specialNeeds: z.array(SpecialNeedSchema),
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
      institution: "",
      captchaToken: "",
      specialNeeds: [],
    },
  });

  const [institutionInput, setInstitutionInput] = useState("");
  const debouncedInstitutionInput = useDebounce(institutionInput, 500);

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: StudentFormData) => {
      const multipartFormData = new FormData();

      const dtoPayload = {
        name: formData.name,
        socialName: formData.socialName || "",
        email: formData.email,
        cpf: formData.cpf,
        birthDate: formData.birthDate,
        gender: formData.gender,
        bolsaFamilia: formData.bolsaFamilia,
        grade: formData.grade,
        ethnicity: formData.ethnicity,
        completionElementarySchoolCategory: formData.completionElementarySchoolCategory,
        incomeRange: formData.incomeRange,
        institutionId: formData.institution,
        captchaToken: formData.captchaToken,
        specialNeeds: [] as {
          specialNeedTitle: string;
          type: string;
          observation?: string; 
          medicalReportIdentifier: string;
        }[],
      };

      formData.specialNeeds?.forEach((need) => {
        const medicalReportIdentifier = crypto.randomUUID();
        const file = need.medicalReportFile[0];

        multipartFormData.append(medicalReportIdentifier, file);

        dtoPayload.specialNeeds.push({
          specialNeedTitle: need.description,
          type: need.type,
          observation: need.observation, 
          medicalReportIdentifier: medicalReportIdentifier,
        });
      });

      multipartFormData.append(
        "dto",
        new Blob([JSON.stringify(dtoPayload)], {
          type: "application/json",
        })
      );
      console.log(multipartFormData)
      return createStudentAndEnrollmentInEdition(multipartFormData, editionYear);
    },
    onSuccess: () => {
      reset();
      showToast("Inscrição realizada com sucesso!", "success");
      scrollToTop();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        showToast(error.message, "error");
      } else {
        console.error("Erro não capturado pela API:", error);
        showToast(error.message || "Ocorreu um erro inesperado.", "error");
      }
    },
  });

  const { data: institutionOptions, isLoading: isInstitutionsLoading } =
    useQuery({
      queryKey: ["institutions", debouncedInstitutionInput, editionYear],
      queryFn: () =>
        fetchInstitutions(debouncedInstitutionInput, String(editionYear)),
      placeholderData: (previousData) => previousData,
    });

  const onReset = () => {
    reset();
    scrollToTop();
  };

  const onSubmit = (data: StudentFormData) => {
    mutate(data);
  };

  return {
    register,
    control,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    handleReset: onReset,
    isPending,
    institutionOptions: institutionOptions || [],
    isInstitutionsLoading,
    setInstitutionInput,
  };
};
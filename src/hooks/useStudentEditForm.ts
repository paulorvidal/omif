import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudentById, updateStudent } from "../services/studentService";
import { showToast, redirectTo } from "../utils/events";
import { fetchInstitutions } from "../services/institutionService";
import { useDebounce } from "./useDebounce";
import type { Institution } from "../types/institutionTypes";
import type { PageResponse } from "../types/defaultTypes";

const StudentFormSchema = z.object({
    name: z.string().nonempty("O nome é obrigatório"),
    socialName: z.string().nullable().optional(),
    email: z.string().email("Email inválido"),
    cpf: z
        .string()
        .nonempty("O CPF é obrigatório")
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Formato de CPF inválido"),
    birthDate: z.string().refine(
        (val) => !isNaN(Date.parse(val)),
        "Data inválida"
    ),
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

export const useStudentEditForm = (studentId?: string) => {
    const queryClient = useQueryClient();
    const [institutionInput, setInstitutionInput] = useState("");
    const debouncedInstitutionInput = useDebounce(institutionInput, 500);


    const { data: studentData, isLoading: isLoadingStudent, isError } = useQuery({
        queryKey: ["student", studentId],
        queryFn: () => getStudentById(studentId!),
        enabled: !!studentId,
        retry: false,
    });

    useEffect(() => {
        if (isError) {
            showToast("Estudante não encontrado.", "error");
            redirectTo("/estudantes");
        }
    }, [isError]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isDirty, dirtyFields },
        reset,
    } = useForm<StudentFormData>({
        resolver: zodResolver(StudentFormSchema),
        defaultValues: {
            institution: null,
        }
    });

    const { mutate: updateStudentMutation, isPending: isUpdating } = useMutation({
        mutationFn: updateStudent,
       onSuccess: (updatedStudent) => {
            queryClient.invalidateQueries({ queryKey: ["student", studentId] });
            const formattedData = {
                ...updatedStudent,
                birthDate: updatedStudent.birthDate 
                    ? new Date(updatedStudent.birthDate).toISOString().split('T')[0] 
                    : '',
                institution: updatedStudent.institution
                    ? {
                          label: updatedStudent.institution.name,
                          value: updatedStudent.institution.id,
                      }
                    : null,
            };

            reset(formattedData); 
            showToast("Estudante atualizado com sucesso!", "success");
        },
        onError: (error) => {
            showToast(error.message, "error")
        },
    });

    const { data: institutionOptions, isLoading: isInstitutionsLoading } = useQuery({
        queryKey: ["institutions", debouncedInstitutionInput],

        queryFn: () =>
            fetchInstitutions({
                q: debouncedInstitutionInput,
                page: 0,
                size: 10
            }),

        select: (data: PageResponse<Institution>) =>
            data.content.map((institution) => ({
                label: institution.name,
                value: institution.id,
            })),
    });

    useEffect(() => {
        if (studentData) {
            const formattedData = {
                ...studentData,
                birthDate: studentData.birthDate
                    ? new Date(studentData.birthDate).toISOString().split('T')[0]
                    : '',
                institution: studentData.institution
                    ? {
                        label: studentData.institution.name,
                        value: studentData.institution.id,
                    }
                    : null,
            };
            reset(formattedData);
        }
    }, [studentData, reset]);

    const handleFormSubmit = (formData: StudentFormData) => {
        if (!isDirty) {
            showToast("Nenhuma alteração para salvar", "info");
            return;
        }
        if (!studentId) {
            showToast("Erro: ID do estudante não encontrado para a atualização.", "error");
            return;
        }

        const changedData = Object.keys(dirtyFields).reduce((acc, key) => {
            const fieldKey = key as keyof StudentFormData;
            if (dirtyFields[fieldKey]) {
                (acc as any)[fieldKey] = formData[fieldKey];
            }
            return acc;
        }, {} as Partial<StudentFormData>);

        const { institution, ...restOfData } = changedData;
        const payload = { ...restOfData } as any;
        if (institution) {
            payload.institutionId = institution.value;
        }
        if (Object.keys(payload).length > 0) {
            updateStudentMutation({ id: studentId, data: payload });
        }
    };


    return {
        register,
        onSubmit: handleSubmit(handleFormSubmit),
        errors,
        control,
        isLoadingStudent,
        isUpdating,
        isDirty,
        reset,

        institutionOptions: institutionOptions ?? [],
        isInstitutionsLoading,
        setInstitutionInput,
    };
};
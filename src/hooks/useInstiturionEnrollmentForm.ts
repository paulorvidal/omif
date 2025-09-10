import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollInEdition, getEnrollmentStatus } from "../services/institutionEnrollmentService";
import { type EnrollmentPayload } from "../types/institutionEnrollmentTypes";
import { scrollToTop } from "../utils/scrollToTop";
import { showToast } from "../utils/events";

const EnrollmentFormSchema = z.object({
    name: z.string().nonempty("O nome é obrigatório"),
    inep: z.string().optional(),
    email1: z.string().nonempty("Informe ao menos um e‑mail").email("Email inválido"),
    email2: z.string().email("Email inválido").optional().or(z.literal("")),
    email3: z.string().email("Email inválido").optional().or(z.literal("")),
    phoneNumber: z
        .string()
        .nonempty("O telefone é obrigatório")
        .regex(
            /^\(\d{2}\)\s?9?\d{4}-\d{4}$/,
            "O número deve estar no formato (XX)9XXXX-XXXX ou (XX)XXXX-XXXX.",
        ),
});

type FormData = z.infer<typeof EnrollmentFormSchema>;

type UseEnrollmentFormProps = {
    editionYear: string;
};

export const useInstiturionEnrollmentForm = ({ editionYear }: UseEnrollmentFormProps) => {
    const queryClient = useQueryClient();

    const { register, handleSubmit, control, formState: { errors, isDirty }, reset } = useForm<FormData>({
        resolver: zodResolver(EnrollmentFormSchema),
    });


    const { data: enrollmentStatus, isLoading: isLoadingStatus, isError } = useQuery({
        queryKey: ['enrollmentStatus', editionYear],
        queryFn: () => getEnrollmentStatus(editionYear!),

        enabled: !!editionYear,
    });
    useEffect(() => {
        if (enrollmentStatus?.institution) {
            const { institution } = enrollmentStatus;
            reset({
                name: institution.name,
                inep: institution.inep ?? "",
                email1: institution.email1,
                email2: institution.email2 ?? "",
                email3: institution.email3 ?? "",
                phoneNumber: institution.phoneNumber,
            });
        }
    }, [enrollmentStatus, reset]);

    const { mutate: submitEnrollment, isPending: isSubmitting } = useMutation({
        mutationFn: (payload: EnrollmentPayload) => enrollInEdition(editionYear, payload),
        onSuccess: () => {
            showToast("Inscrição realizada com sucesso!", "success");
            queryClient.invalidateQueries({ queryKey: ['enrollmentStatus', editionYear] });
        },
        onError: (err) => {
            const axiosErr = err as AxiosError<{ message: string }>;
            const message = axiosErr.response?.data?.message ?? "Ocorreu um erro ao realizar a inscrição.";
            showToast(message, "error");
        },
    });

    const handleFormSubmit = handleSubmit((data: FormData) => {
        let payload: EnrollmentPayload;

        if (isDirty) {
            payload = {
                name: data.name,
                inep: data.inep || null,
                phoneNumber: data.phoneNumber,
                email1: data.email1,
                email2: data.email2 || null,
                email3: data.email3 || null,
            };
        } else {
            payload = {
                name: null,
                inep: null,
                phoneNumber: null,
                email1: null,
                email2: null,
                email3: null,
            };
        }

        submitEnrollment(payload);
    });

    const handleReset = () => {
        if (enrollmentStatus?.institution) {
            const { institution } = enrollmentStatus;
            reset({
                name: institution.name,
                inep: institution.inep ?? "",
                email1: institution.email1,
                email2: institution.email2 ?? "",
                email3: institution.email3 ?? "",
                phoneNumber: institution.phoneNumber,
            });
        }
        scrollToTop();
    };

    return {
        control,
        errors,
        isSubmitting,
        isLoadingStatus,
        isError,
        register,
        handleFormSubmit,
        handleReset,
        enrollmentData: enrollmentStatus,
    };
};
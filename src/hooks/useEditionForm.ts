import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ApiError } from "../services/apiError";
import {
    createEdition,
    updateEdition,
    getEditionById,
} from "../services/editionService";
import type {
    CreateEditionRequest,
    UpdateEditionRequest,
} from "../types/editionTypes"
import { redirectTo, showToast } from "../utils/events";
import { useQuery, useMutation } from "@tanstack/react-query";


const EditionFormSchema = z.object({
    name: z.string().nonempty("O nome é obrigatório"),
    year: z.coerce.number().min(2000, "O ano deve ser válido"),
    minimumWage: z.string().nonempty("O salário mínimo é obrigatório"),
    registrationStartDate: z.string().nonempty("A data de início das inscrições é obrigatória"),
    registrationEndDate: z.string().nonempty("A data de fim das inscrições é obrigatória"),
}).refine(data => new Date(data.registrationEndDate) > new Date(data.registrationStartDate), {
    message: "O fim das inscrições deve ser após o início.",
    path: ["registrationEndDate"],
});

type FormData = z.infer<typeof EditionFormSchema>;

type UseEditionFormProps = {
    editionId?: string;
};

export const useEditionForm = ({ editionId }: UseEditionFormProps) => {
    const isEditMode = Boolean(editionId);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,

    } = useForm<FormData>({
        resolver: zodResolver(EditionFormSchema),
        defaultValues: {
            name: "",
            year: new Date().getFullYear(),
            minimumWage: "",
            registrationStartDate: "",
            registrationEndDate: "",
        },
    });

    const { data: editionData, isLoading: isEditionLoading } = useQuery({
        queryKey: ['edition', editionId],
        queryFn: () => getEditionById(editionId!),
        enabled: isEditMode,
    });

    useEffect(() => {
        if (editionData) {
            const formatDateForInput = (dateString: string) => dateString ? new Date(dateString).toISOString().slice(0, 16) : "";

            reset({
                name: editionData.name,
                year: editionData.year,
                minimumWage: String(editionData.minimumWage).replace('.', ','),
                registrationStartDate: formatDateForInput(editionData.registrationStartDate),
                registrationEndDate: formatDateForInput(editionData.registrationEndDate),
            });
        }
    }, [editionData, reset]);

    const { mutate, isPending } = useMutation({
        mutationFn: (requestData: CreateEditionRequest | UpdateEditionRequest) => {
            if (isEditMode) {
                return updateEdition(requestData as UpdateEditionRequest);
            }
            return createEdition(requestData as CreateEditionRequest);
        },
        onSuccess: (data) => {
            showToast(isEditMode ? "Edição atualizada com sucesso" : "Edição criada com sucesso", "success");
            const returnedId = data.id
            redirectTo(`/etapas/${returnedId}`);
        },
        onError: (error) => showToast(error instanceof ApiError ? error.message : "Falha na requisição.", "error"),
    });


    const handleFormSubmit = handleSubmit(async (data: FormData) => {
        if (isEditMode && !isDirty) return showToast("Nenhuma alteração para salvar", "info");
        const basePayload = {
            ...data,
            minimumWage: data.minimumWage.replace(',', '.'),
        };

        if (isEditMode) {
            const updatePayload: UpdateEditionRequest = {
                editionId: editionId!,
                ...basePayload,
            };
            mutate(updatePayload);
        } else {
            mutate(basePayload);
        }
    });

    const handleReset = () => reset();

    return {
        errors,
        isEditMode,
        isPending,
        isEditionLoading,
        register,
        handleFormSubmit,
        handleReset,
    };
};
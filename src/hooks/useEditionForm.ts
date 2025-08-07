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
    startDate: z.string().nonempty("A data de início da vigência é obrigatória"),
    endDate: z.string().nonempty("A data de fim da vigência é obrigatória"),
    registrationStartDate: z.string().nonempty("A data de início das inscrições é obrigatória"),
    registrationEndDate: z.string().nonempty("A data de fim das inscrições é obrigatória")

}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
    message: "O fim da vigência deve ser após o início.",
    path: ["endDate"],
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
    // const queryClient = useQueryClient();

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
            startDate: "",
            endDate: "",
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
                startDate: formatDateForInput(editionData.startDate),
                endDate: formatDateForInput(editionData.endDate),
                registrationStartDate: formatDateForInput(editionData.registrationStartDate),
                registrationEndDate: formatDateForInput(editionData.registrationEndDate),
                
            });
        }
    }, [editionData, reset]);

    const { mutate, isPending } = useMutation({
        mutationFn: (payload: CreateEditionRequest | UpdateEditionRequest) => {
            if (isEditMode) return updateEdition({ editionId: editionId!, ...payload } as UpdateEditionRequest);
            return createEdition(payload as CreateEditionRequest);
        },
        onSuccess: () => {
            showToast(isEditMode ? "Edição atualizada com sucesso" : "Edição criada com sucesso", "success");
            redirectTo("/edicoes");
        },
        onError: (error) => showToast(error instanceof ApiError ? error.message : "Falha na requisição.", "error"),
    });

    const handleFormSubmit = handleSubmit(async (data: FormData) => {
        if (isEditMode && !isDirty) return showToast("Nenhuma alteração para salvar", "info");

        const payload = {
            name: data.name,
            year: data.year,
            minimumWage: data.minimumWage.replace(',', '.'),
            startDate: data.startDate,
            endDate: data.endDate,
            registrationStartDate: data.registrationStartDate,
            registrationEndDate: data.registrationEndDate,
        };
        mutate(payload);
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
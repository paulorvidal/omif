import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ApiError } from "../services/apiError";
import {
    createEdition,
    updateEdition,
    getEditionById,
    type CreateEditionRequest,
    type UpdateEditionRequest
} from "../services/editionService";
import { scrollToTop } from "../utils/scrollToTop";
import { redirectTo, showToast } from "../utils/events";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const EditionFormSchema = z.object({
    name: z.string().nonempty("O nome é obrigatório"),
    year: z.coerce.number().min(2000, "O ano deve ser válido"),
    minimumWage: z.string().nonempty("O salário mínimo é obrigatório"),
    startDate: z.string().nonempty("A data de início da vigência é obrigatória"),
    endDate: z.string().nonempty("A data de fim da vigência é obrigatória"),
    registrationStartDate: z.string().nonempty("A data de início das inscrições é obrigatória"),
    registrationEndDate: z.string().nonempty("A data de fim das inscrições é obrigatória"),
}).refine(data => {
    if (!data.startDate || !data.endDate) return true;
    return new Date(data.endDate) > new Date(data.startDate);
}, {
    message: "O fim da vigência deve ser após o início.",
    path: ["endDate"],
}).refine(data => {
    if (!data.registrationStartDate || !data.registrationEndDate) return true;
    return new Date(data.registrationEndDate) > new Date(data.registrationStartDate);
}, {
    message: "O fim das inscrições deve ser após o início.",
    path: ["registrationEndDate"],
}).refine(data => {
    if (!data.registrationStartDate || !data.startDate || !data.endDate) return true;
    const regStart = new Date(data.registrationStartDate);
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return regStart >= start && regStart < end;
}, {
    message: "Deve ser entre as datas de vigência da edição.",
    path: ["registrationStartDate"],
}).refine(data => {
    if (!data.registrationEndDate || !data.endDate) return true;
    return new Date(data.registrationEndDate) <= new Date(data.endDate);
}, {
    message: "Deve ser antes do fim da vigência da edição.",
    path: ["registrationEndDate"],
});;

type FormData = z.infer<typeof EditionFormSchema>;

type UseEditionFormProps = {
    editionId?: string;
};

export const useEditionForm = ({ editionId }: UseEditionFormProps) => {
    const isEditMode = Boolean(editionId);
    const queryClient = useQueryClient();

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
            const formatDateForInput = (dateString: string) => {
                if (!dateString) return "";
                const date = new Date(dateString);
                return isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
            };
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
        mutationFn: (payload: CreateEditionRequest) => {
        if (isEditMode) {
            return updateEdition({ editionId: editionId!, ...payload });
        }
        return createEdition(payload);
    },
        onSuccess: () => {
            showToast(
                isEditMode ? "Edição atualizada com sucesso" : "Edição criada com sucesso",
                "success"
            );
            queryClient.invalidateQueries({ queryKey: ['editions'] });
            if (isEditMode) {
                queryClient.invalidateQueries({ queryKey: ['edition', editionId] });
            }
            redirectTo("/edicoes");
        },
        onError: (error) => {
            const message = error instanceof ApiError ? error.message : "Falha ao reverter validação.";
            showToast(message, "error");
        },
    });


    const handleFormSubmit = handleSubmit(async (data: FormData) => {
        if (isEditMode && !isDirty) {
            showToast("Nenhuma alteração para salvar", "info");
            return;
        }
        const payload: CreateEditionRequest = {
            ...data,
            minimumWage: data.minimumWage.replace(',', '.'),
        };
        mutate(payload);
    });

    const handleReset = () => {
        reset();
        scrollToTop();
    };

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
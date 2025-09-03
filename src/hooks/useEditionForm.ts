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
    startDate: z.string().nonempty("A data de início da edição é obrigatória"),
    endDate: z.string().nonempty("A data de fim da edição é obrigatória"),
    institutionRegistrationStartDate: z.string().nonempty("A data de início para instituições é obrigatória"),
    institutionRegistrationEndDate: z.string().nonempty("A data de fim para instituições é obrigatória"),
    studentRegistrationStartDate: z.string().nonempty("A data de início para estudantes é obrigatória"),
    studentRegistrationEndDate: z.string().nonempty("A data de fim para estudantes é obrigatória"),
})
    .refine(data => new Date(data.endDate) > new Date(data.startDate), {
        message: "O fim da edição deve ser após o início.",
        path: ["endDate"],
    })
    .refine(data => new Date(data.institutionRegistrationEndDate) > new Date(data.institutionRegistrationStartDate), {
        message: "O fim das inscrições de instituições deve ser após o início.",
        path: ["institutionRegistrationEndDate"],
    })
    .refine(data => new Date(data.studentRegistrationEndDate) > new Date(data.studentRegistrationStartDate), {
        message: "O fim das inscrições de estudantes deve ser após o início.",
        path: ["studentRegistrationEndDate"],
    })
    .refine(data => new Date(data.institutionRegistrationStartDate) >= new Date(data.startDate), {
        message: "O início da inscrição de instituições deve ser igual ou posterior ao início da edição.",
        path: ["institutionRegistrationStartDate"],
    })
    .refine(data => new Date(data.institutionRegistrationEndDate) <= new Date(data.endDate), {
        message: "O fim da inscrição de instituições deve ser igual ou anterior ao fim da edição.",
        path: ["institutionRegistrationEndDate"],
    })
    .refine(data => new Date(data.studentRegistrationStartDate) >= new Date(data.startDate), {
        message: "O início da inscrição de estudantes deve ser igual ou posterior ao início da edição.",
        path: ["studentRegistrationStartDate"],
    })
    .refine(data => new Date(data.studentRegistrationEndDate) <= new Date(data.endDate), {
        message: "O fim da inscrição de estudantes deve ser igual ou anterior ao fim da edição.",
        path: ["studentRegistrationEndDate"],
    })
    .refine(data => new Date(data.studentRegistrationStartDate) >= new Date(data.institutionRegistrationEndDate), {
        message: "O início da inscrição de estudantes deve ser igual ou posterior ao fim da inscrição de instituições.",
        path: ["studentRegistrationStartDate"],
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
            startDate: "",
            endDate: "",
            institutionRegistrationStartDate: "",
            institutionRegistrationEndDate: "",
            studentRegistrationStartDate: "",
            studentRegistrationEndDate: "",
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
                institutionRegistrationStartDate: formatDateForInput(editionData.institutionRegistrationStartDate),
                institutionRegistrationEndDate: formatDateForInput(editionData.institutionRegistrationEndDate),
                studentRegistrationStartDate: formatDateForInput(editionData.studentRegistrationStartDate),
                studentRegistrationEndDate: formatDateForInput(editionData.studentRegistrationEndDate),
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
            const returnedId = data.id;
            redirectTo(`/etapas/${returnedId}`);
        },
        onError: (error) => showToast(error instanceof ApiError ? error.message : "Falha na requisição.", "error"),
    });

    const handleFormSubmit = handleSubmit(async (data: FormData) => {
        if (isEditMode && !isDirty) return showToast("Nenhuma alteração para salvar", "info");
        const payload = {
            ...data,
            minimumWage: data.minimumWage.replace(',', '.'),
            startDate: new Date(data.startDate).toISOString(),
            endDate: new Date(data.endDate).toISOString(),
            institutionRegistrationStartDate: new Date(data.institutionRegistrationStartDate).toISOString(),
            institutionRegistrationEndDate: new Date(data.institutionRegistrationEndDate).toISOString(),
            studentRegistrationStartDate: new Date(data.studentRegistrationStartDate).toISOString(),
            studentRegistrationEndDate: new Date(data.studentRegistrationEndDate).toISOString(),
        };

        if (isEditMode) {
            const updatePayload: UpdateEditionRequest = {
                editionId: editionId!,
                ...payload,
            };
            mutate(updatePayload);
        } else {
            mutate(payload as CreateEditionRequest);
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

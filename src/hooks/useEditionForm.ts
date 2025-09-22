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
import { maskCurrency } from '../utils/formatters';

const cleanCurrencyString = (value: string) => value.replace(/[R$\s.,]/g, '');

const EditionFormSchema = z.object({
    name: z.string().nonempty("O nome é obrigatório"),
    year: z.coerce.number().min(2000, "O ano deve ser válido"),
    minimumWage: z.string({ required_error: "O salário mínimo é obrigatório" })
        .nonempty("O salário mínimo é obrigatório")
        .transform(cleanCurrencyString)
        .refine(value => {
            const num = Number(value) / 100;
            return !isNaN(num) && num > 0;
        }, { message: "O salário mínimo deve ser maior que zero" }),

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
type EditionFormInput = z.input<typeof EditionFormSchema>;

type UseEditionFormProps = {
    editionId?: string;
};

export const useEditionForm = ({ editionId }: UseEditionFormProps) => {
    const isEditMode = Boolean(editionId);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty, dirtyFields },
        reset,
        watch,
        setValue
    } = useForm<EditionFormInput>({
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

            const numericWage = Number(editionData.minimumWage);

            const wageInCentsString = String(numericWage * 100);

            const formattedMinimumWage = maskCurrency(wageInCentsString);

            reset({
                name: editionData.name,
                year: editionData.year,
                minimumWage: formattedMinimumWage,
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
        mutationFn: (requestData: CreateEditionRequest | Partial<UpdateEditionRequest>) => {
            if (isEditMode) {
                return updateEdition(requestData as Partial<UpdateEditionRequest>);
            }
            return createEdition(requestData as CreateEditionRequest);
        },
        onSuccess: (data) => {
            showToast(isEditMode ? "Edição atualizada com sucesso" : "Edição criada com sucesso", "success");
            const returnedId = data.id;
            redirectTo(`/edicoes/${returnedId}/etapas`);
        },
        onError: (error) => showToast(error instanceof ApiError ? error.message : "Falha na requisição.", "error"),
    });

    const handleFormSubmit = handleSubmit(async (data: FormData) => {

        if (isEditMode && !isDirty) {
            return showToast("Nenhuma alteração para salvar", "info");
        }
        if (isEditMode) {
            const updatedData: Partial<UpdateEditionRequest> = { editionId: editionId! };

            for (const key in dirtyFields) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    const value = data[key as keyof FormData];

                    if (key === 'minimumWage') {
                        (updatedData as any)[key] = String(value);
                    } else if (key.includes('Date')) {
                        (updatedData as any)[key] = new Date(value as string).toISOString();
                    } else {
                        (updatedData as any)[key] = value;
                    }
                }
            }
            mutate(updatedData as Partial<UpdateEditionRequest>);
        } else {
            const payload: CreateEditionRequest = {
                ...data,
                minimumWage: String(data.minimumWage),
                startDate: new Date(data.startDate).toISOString(),
                endDate: new Date(data.endDate).toISOString(),
                institutionRegistrationStartDate: new Date(data.institutionRegistrationStartDate).toISOString(),
                institutionRegistrationEndDate: new Date(data.institutionRegistrationEndDate).toISOString(),
                studentRegistrationStartDate: new Date(data.studentRegistrationStartDate).toISOString(),
                studentRegistrationEndDate: new Date(data.studentRegistrationEndDate).toISOString(),
            };
            mutate(payload);
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
        watch,
        setValue,
    };
};
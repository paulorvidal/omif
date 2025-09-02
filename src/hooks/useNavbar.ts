import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { fetchEditions, getCurrentInstitutionEnrollmentEdition } from "../services/editionService";
import { getMyData } from "../services/educatorService";
import { showToast } from "../utils/events";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const currentYear = new Date().getFullYear();

const defaultOption = {
    label: "Todas",
    value: "todas",
};

const EditionFormSchema = z.object({
    edition: z
        .object({
            label: z.union([z.string(), z.number()]),
            value: z.string().uuid("ID inválido").or(z.literal("todas")),
        })
        .nullable()
        .refine((v) => v !== null, {
            message: "O ano é obrigatório",
        }),
});

export const useNavbar = () => {
    const { control, watch, trigger } = useForm({
        resolver: zodResolver(EditionFormSchema),
        defaultValues: {
            edition: null,
        },
    });

    const queryClient = useQueryClient();

    const { data: userData, isLoading: isUserDataLoading } = useQuery({
        queryKey: ["myData"],
        queryFn: getMyData,
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
    });

    const { data: currentEditionData, isLoading: isCurrentEditionLoading } = useQuery({
        queryKey: ["currentEdition"],
        queryFn: getCurrentInstitutionEnrollmentEdition,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: false,
    });

    const loadOptions = async (inputValue: string) => {
        try {
            const editions = await queryClient.fetchQuery({
                queryKey: ["editions", inputValue],
                queryFn: () => fetchEditions(inputValue),
            });
            return [defaultOption, ...(editions || [])];
        } catch (error) {
            console.error("Failed to fetch editions:", error);
            showToast("Erro ao buscar as edições.", "error");
            return [defaultOption];
        }
    };

    const selectedEdition = watch("edition");

    useEffect(() => {
        if (selectedEdition) {
            trigger("edition").then((isValid) => {
                if (isValid) {
                    localStorage.setItem("edition", selectedEdition.label.toString());
                } else {
                    showToast("Ano inválido.", "error");
                }
            });
        }
    }, [selectedEdition, trigger]);

    const classNames = {
        control: () =>
            "w-full outline-none hover:bg-zinc-200 focus:bg-zinc-200 p-2",
        menu: () => "z-50 w-full",
        menuList: () =>
            "py-1 w-40 bg-white mt-1 rounded-md border-2 border-zinc-300",
        option: ({ isFocused, isSelected }: { isFocused: boolean; isSelected: boolean }) =>
            [
                "px-4 py-2 cursor-pointer",
                isSelected ? "bg-zinc-200" : isFocused && "bg-zinc-200/50",
            ].join(" "),
    };

    const placeholder = localStorage.getItem("edition") ?? currentYear.toString();

    return {
        control,
        loadOptions,
        placeholder,
        classNames,
        userData,
        isUserDataLoading,
        currentEditionData,
        isCurrentEditionLoading,
    };
};
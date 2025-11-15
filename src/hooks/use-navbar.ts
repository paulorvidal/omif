import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  fetchEditions,
  getCurrentInstitutionEnrollmentEdition,
} from "../services/edition-service";
import { getMyData } from "../services/educator-service";
import { showToast } from "../utils/events";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const currentYear = new Date().getFullYear();

const defaultOption = {
  label: "Todas",
  value: "all",
};

const EditionFormSchema = z.object({
  edition: z.string().uuid("ID inválido").or(z.literal("all")).nullable(),
});

export const useNavbar = () => {
  const { control, watch, trigger, setValue, getValues } = useForm({
    resolver: zodResolver(EditionFormSchema),
    defaultValues: {
      edition: null,
    },
  });

  const queryClient = useQueryClient();

  const {
    data: editionOptions = [],
    isLoading: isEditionLoading,
    isError: isEditionError,
  } = useQuery({
    queryKey: ["editions"],
    queryFn: async () => {
      try {
        const editions = await queryClient.fetchQuery({
          queryKey: ["editions-data"],
          queryFn: () => fetchEditions(""),
        });
        return [defaultOption, ...(editions || [])];
      } catch (error) {
        showToast("Erro ao buscar as edições.", "error");
        return [defaultOption];
      }
    },
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (editionOptions.length > 0 && !getValues("edition")) {
      const storedEditionLabel = localStorage.getItem("edition");
      let initialValueToSet = null;

      if (storedEditionLabel && storedEditionLabel !== "all") {
        const foundEdition = editionOptions.find(
          (e) => e.label.toString() === storedEditionLabel,
        );
        if (foundEdition) {
          initialValueToSet = foundEdition.value;
        }
      } else if (storedEditionLabel === "all") {
        initialValueToSet = defaultOption.value;
      }

      if (!initialValueToSet) {
        const numericEditions = editionOptions.filter((e) => e.value !== "all");
        if (numericEditions.length > 0) {
          numericEditions.sort((a, b) => Number(b.label) - Number(a.label));
          initialValueToSet = numericEditions[0].value;
        } else {
          initialValueToSet = defaultOption.value;
        }
      }

      setValue("edition", initialValueToSet);
    }
  }, [editionOptions, setValue, getValues]);

  const { data: userData, isLoading: isUserDataLoading } = useQuery({
    queryKey: ["myData"],
    queryFn: getMyData,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const isAllowedToEnroll = [
    "COORDENADOR_LOCAL",
    "ADMINISTRADOR",
    "COMISSAO_ORGANIZADORA",
  ].includes(userData?.role ?? "");

  const { data: currentEditionData, isLoading: isCurrentEditionLoading } =
    useQuery({
      queryKey: ["currentEdition"],
      queryFn: getCurrentInstitutionEnrollmentEdition,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: isAllowedToEnroll,
    });

  const selectedEditionValue = watch("edition");

  useEffect(() => {
    if (selectedEditionValue && editionOptions.length > 0) {
      trigger("edition").then((isValid) => {
        if (isValid) {
          const selectedObject = editionOptions.find(
            (opt) => opt.value === selectedEditionValue,
          );

          if (!selectedObject) return;

          const valueToStore =
            selectedObject.value === "all"
              ? "all"
              : selectedObject.label.toString();
          localStorage.setItem("edition", valueToStore);
          if (
            selectedObject.value === "all" ||
            typeof selectedObject.isActive === "undefined"
          ) {
            localStorage.removeItem("editionIsActive");
          } else {
            localStorage.setItem(
              "editionIsActive",
              String(selectedObject.isActive),
            );
          }
          window.dispatchEvent(new Event("editionChange"));
        } else {
          showToast("Ano inválido.", "error");
        }
      });
    }
  }, [selectedEditionValue, trigger, editionOptions]);

  const classNames = {
    control: () =>
      "w-full outline-none hover:bg-zinc-200 focus:bg-zinc-200 p-2",
    menu: () => "z-50 w-full",
    menuList: () =>
      "py-1 w-40 bg-white mt-1 rounded-md border-2 border-zinc-300",
    option: ({
      isFocused,
      isSelected,
    }: {
      isFocused: boolean;
      isSelected: boolean;
    }) =>
      [
        "px-4 py-2 cursor-pointer",
        isSelected ? "bg-zinc-200" : isFocused && "bg-zinc-200/50",
      ].join(" "),
  };

  const storedEdition = localStorage.getItem("edition");
  const placeholder =
    storedEdition === "all"
      ? "Todas"
      : (storedEdition ?? currentYear.toString());

  return {
    control,
    editionOptions,
    isEditionLoading,
    placeholder,
    classNames,
    userData,
    isUserDataLoading,
    currentEditionData,
    isCurrentEditionLoading,
  };
};

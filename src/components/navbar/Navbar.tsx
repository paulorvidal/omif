import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncSelect from "react-select/async";
import { z } from "zod";
import { fetchEditions } from "../../services/editionService";
import { Calendar, CircleUserRound } from "lucide-react";
import { NavLink } from "react-router";
import { showToast } from "../../utils/events";

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

const loadOptions = async (inputValue: string) => {
  const editions = await fetchEditions(inputValue);
  return [defaultOption, ...editions];
};

export const Navbar = () => {
  const { control, watch, trigger } = useForm({
    resolver: zodResolver(EditionFormSchema),
  });

  const selectedEdition = watch("edition");

  useEffect(() => {
    if (selectedEdition) {
      trigger("edition").then((isValid) => {
        if (isValid) {
          localStorage.setItem("edition", selectedEdition?.label.toString());
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
      "py-1 w-40 bg-white mt-1 rounded-md border-2 border-zinc-300 ",
    option: ({ isFocused, isSelected }: any) =>
      [
        "px-4 py-2 cursor-pointer",
        isSelected ? "bg-zinc-200" : isFocused && "bg-zinc-200/50",
      ].join(" "),
  };

  return (
    <div className="fixed top-0 left-0 z-30 flex h-14 w-full items-center justify-between bg-zinc-100 px-4 shadow-md md:px-8 md:ps-22">
      <div className="flex items-center">
        <Calendar className="h-8 w-8 p-1" />
        <Controller
          name="edition"
          control={control}
          render={({ field }) => (
            <AsyncSelect
              {...field}
              name={field.name}
              inputId="edition"
              cacheOptions
              defaultOptions={true}
              loadOptions={loadOptions}
              getOptionLabel={(opt) => String(opt.label)}
              getOptionValue={(opt) => opt.value}
              value={field.value ?? null}
              placeholder={
                localStorage.getItem("edition") ?? currentYear.toString()
              }
              unstyled
              classNames={classNames}
            />
          )}
        />
      </div>
      <NavLink
        to="/perfil"
        className="flex cursor-pointer items-center rounded-sm duration-300 hover:bg-zinc-200 focus:bg-zinc-200 sm:ps-2"
      >
        <p className="hidden sm:block">Nome do Usuário</p>
        <div className="h-10 w-10 shrink-0">
          <CircleUserRound className="h-10 w-10 p-2" />
        </div>
      </NavLink>
    </div>
  );
};

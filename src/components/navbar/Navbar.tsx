import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, CircleUserRound } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { NavLink } from "react-router";
import { z } from "zod";
import { Controller } from "react-hook-form";

const currentYear = new Date().getFullYear();

const EditionFormSchema = z.object({
  year: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .nullable()
    .refine((v) => v !== null, {
      message: "O ano é obrigatório",
    })
    .refine(
      (v) => {
        if (!v) return false;
        const yearInt = parseInt(v.value, 10);
        return yearInt >= 1970 && yearInt <= currentYear;
      },
      { message: `O ano deve estar entre 1970 e ${currentYear}` },
    ),
});

export const Navbar = () => {
  const classNames = {
    control: () =>
      "w-full outline-none   hover:bg-zinc-200 focus:bg-zinc-200 p-2",
    menu: () => "z-50 w-full",
    menuList: () =>
      "py-1 w-40 bg-white mt-1 rounded-md border-2 border-zinc-300 ",
    option: ({ isFocused, isSelected }: any) =>
      [
        "px-4 py-2 cursor-pointer",
        isSelected ? "bg-zinc-200" : isFocused && "bg-zinc-200/50",
      ].join(" "),
  };
  const { control, watch, trigger } = useForm({
    resolver: zodResolver(EditionFormSchema),
    defaultValues: {
      year: {
        label: String(currentYear),
        value: String(currentYear),
      },
    },
  });

  const selectedYear = watch("year");
  useEffect(() => {
    if (selectedYear) {
      trigger().then((isValid) => {
        if (isValid) {
          console.log("Ano --> ", selectedYear.value);

          // TO DO
        }
      });
    }
  }, [selectedYear, trigger]);

  return (
    <div className="fixed top-0 left-0 z-30 flex h-14 w-full items-center justify-between bg-zinc-100 px-4 shadow-md md:px-8 md:ps-22">
      <div className="flex items-center">
        <Calendar className="h-8 w-8 p-1" />
        <Controller
          name="year"
          control={control}
          render={({ field }) => (
            <AsyncSelect
              {...field}
              unstyled
              loadOptions={[{ label: "2025", value: "2025" }]}
              onChange={(option) => field.onChange(option)}
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

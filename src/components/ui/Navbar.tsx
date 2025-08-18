import { Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { Calendar } from "lucide-react";
import { NavLink } from "react-router";
import { useNavbar } from "../../hooks/useNavbar";
import { getInitials } from "../../utils/formatters";

export const Navbar = () => {
  const {
    control,
    loadOptions,
    placeholder,
    classNames,
    userData,
    isUserDataLoading
  } = useNavbar();

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
              defaultOptions
              loadOptions={loadOptions}
              getOptionLabel={(opt) => String(opt.label)}
              getOptionValue={(opt) => opt.value}
              value={field.value ?? null}
              placeholder={placeholder}
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
        <p
          className="hidden sm:block truncate max-w-[200px]"
          title={userData?.socialName || 'Meu Perfil'}
        >
          {isUserDataLoading
            ? 'Carregando...'
            : (userData?.socialName || 'Meu Perfil')
          }
        </p>
        <div className="h-10 w-10 shrink-0 p-1">
          {userData && userData.profilePictureUrl ? (
            <img
              src={userData.profilePictureUrl}
              alt="Foto de Perfil"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-green-500">
              <span className="font-bold text-white">
                {getInitials(userData?.socialName)}
              </span>
            </div>
          )}
        </div>
      </NavLink>
    </div>
  );
};
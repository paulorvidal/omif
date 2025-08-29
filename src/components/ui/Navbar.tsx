import { useState, useEffect } from "react";
import { Megaphone, Calendar } from "lucide-react";
import { Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { NavLink } from "react-router-dom";
import { useNavbar } from "../../hooks/useNavbar";
import { getInitials } from "../../utils/formatters";

export const Navbar = () => {
  const {
    control,
    loadOptions,
    placeholder,
    classNames,
    userData,
    isUserDataLoading,
    currentEditionData,
    isCurrentEditionLoading,
  } = useNavbar();

  const isAdmin = userData?.role === 'ADMINISTRADOR';

  const shouldShowEnrollmentAlert =
    !isCurrentEditionLoading &&
    currentEditionData?.isActive;

  const [isAlertAnimatingIn, setIsAlertAnimatingIn] = useState(false);

  useEffect(() => {
    if (shouldShowEnrollmentAlert) {
      const timer = setTimeout(() => setIsAlertAnimatingIn(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsAlertAnimatingIn(false);
    }
  }, [shouldShowEnrollmentAlert]);

  return (
    <div className="fixed top-0 left-0 z-30 flex h-14 w-full items-center justify-between bg-zinc-100 px-4 shadow-md md:px-8 md:ps-22">
      {isAdmin ? (
        <div className="flex flex-1 items-center">
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

          {shouldShowEnrollmentAlert && (
            <div
              className={`
                ml-3 md:ml-6 flex items-center gap-2 md:gap-3 rounded-full bg-white px-3 md:px-4 py-1.5 md:py-2 text-sm text-zinc-800 
                transform transition-all duration-300 ease-out
                ${isAlertAnimatingIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
              `}
            >
              <span className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-amber-500">
                <Megaphone className="h-3 w-3 md:h-3.5 md:w-3.5 text-white" />
              </span>
              
              <span className="flex items-center">
                <span className="hidden md:inline">
                  Inscrições abertas para <strong>{currentEditionData.editionName}</strong>!
                </span>
                
                <NavLink
                  to={`/edicoes/${currentEditionData.editionYear}/inscrever-instituicao`}
                  className="md:ml-2 font-semibold text-amber-600 underline hover:text-amber-500"
                >
                  Inscrever
                </NavLink>
              </span>
            </div>
          )}
        </div>
      ) : (
        <div />
      )}

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
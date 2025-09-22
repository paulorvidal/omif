import { useNavbar } from "src/hooks/useNavbar";
import { SidebarInset } from "./sidebar";
import { Calendar, ChevronLeft, Megaphone } from "lucide-react";
import { Controller } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useMatches, useNavigate } from "react-router-dom";
import { getInitials } from "src/utils/formatters";
import { H2 } from "./H2";

interface RouteHandle {
  title?: string;
  showBackButton?: boolean;
}

function Navbar() {
  const navigate = useNavigate();

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

  const shouldShowEnrollmentAlert =
    !isCurrentEditionLoading && currentEditionData?.isActive;

  const isAdmin = userData?.role === "ADMINISTRADOR";

  const [isAlertAnimatingIn, setIsAlertAnimatingIn] = useState(false);

  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];
  const handle = currentRoute?.handle as RouteHandle;
  const title = handle?.title;
  const showBackButton = handle?.showBackButton;

  useEffect(() => {
    if (shouldShowEnrollmentAlert) {
      const timer = setTimeout(() => setIsAlertAnimatingIn(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsAlertAnimatingIn(false);
    }
  }, [shouldShowEnrollmentAlert]);

  return (
    <SidebarInset>
      <header className="bg-background sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <div className="flex flex-1 items-center">
          {isAdmin && (
            <div className="flex items-center">
              <Calendar className="size-4" />
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
          )}

          {shouldShowEnrollmentAlert && (
            <div
              className={`ml-3 flex transform items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm text-zinc-800 transition-all duration-300 ease-out md:ml-6 md:gap-3 md:px-4 md:py-2 ${isAlertAnimatingIn ? "scale-100 opacity-100" : "scale-95 opacity-0"} `}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 md:h-6 md:w-6">
                <Megaphone className="h-3 w-3 text-white md:h-3.5 md:w-3.5" />
              </span>

              <span className="flex items-center">
                <span className="hidden md:inline">
                  Inscrições abertas para{" "}
                  <strong>{currentEditionData.editionName}</strong>!
                </span>

                <NavLink
                  to={`/edicoes/${currentEditionData.editionYear}/inscrever-instituicao`}
                  className="font-semibold text-amber-600 underline hover:text-amber-500 md:ml-2"
                >
                  Inscrever
                </NavLink>
              </span>
            </div>
          )}
        </div>

        <NavLink
          to="/perfil"
          className="flex cursor-pointer items-center rounded-sm duration-300 hover:bg-zinc-200 focus:bg-zinc-200 sm:ps-2"
        >
          <p
            className="hidden max-w-[200px] truncate sm:block"
            title={userData?.socialName || "Meu Perfil"}
          >
            {isUserDataLoading
              ? "Carregando..."
              : userData?.socialName || "Meu Perfil"}
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
      </header>
      <main className="flex flex-col gap-4 p-4 md:p-8">
        {title && (
          <div className="flex items-center gap-2">
            {showBackButton !== false && (
              <ChevronLeft
                size={28}
                className="cursor-pointer rounded-full p-1 text-zinc-600 hover:bg-zinc-200"
                onClick={() => navigate(-1)}
              />
            )}
            <H2>{title}</H2>
          </div>
        )}
        <div className="w-full rounded-md">
          <Outlet />
        </div>
      </main>
    </SidebarInset>
  );
}

export { Navbar };

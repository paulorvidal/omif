import { useNavbar } from "@/hooks/use-navbar";
import { AppButton } from "./app-button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { AppAsyncSelect } from "./app-async-select";

function AppNavbar() {
  const {
    control,
    editionOptions,
    placeholder,
    classNames,
    userData,
    isUserDataLoading,
    currentEditionData,
    isEditionLoading,
  } = useNavbar();

  const isAdmin = userData?.role === "ADMINISTRADOR";

  return (
    <header className="bg-background flex h-(--sidebar-width-icon) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--sidebar-width-icon)">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        {isAdmin ? (
          <div>
            <AppAsyncSelect
              name="edition"
              label="Select Assíncrono"
              control={control}
              options={editionOptions as any}
              isLoading={isEditionLoading}
              isEditionYear
            />
          </div>
        ) : (
          <div />
        )}
        <AppButton variant="ghost">
          <Avatar>
            <AvatarImage />
            <AvatarFallback>N</AvatarFallback>
          </Avatar>
          Nome
        </AppButton>
      </div>
    </header>
  );
}

export { AppNavbar };

import { AppButton } from "./app-button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function AppNavbar() {
  return (
    <header className="bg-background flex h-(--sidebar-width-icon) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--sidebar-width-icon)">
      <div className="flex w-full items-center justify-end gap-1 px-4 lg:gap-2 lg:px-6">
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

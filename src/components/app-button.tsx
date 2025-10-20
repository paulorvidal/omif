import type React from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

type AppButtonProps = {
  children: React.ReactNode;
  icon?: React.ReactElement;
  href?: string;
  isLoading?: boolean;
} & React.ComponentProps<typeof Button>;

function AppButton({
  children,
  icon,
  href,
  isLoading,
  ...props
}: AppButtonProps) {
  return (
    <>
      {href ? (
        <Button asChild {...props}>
          <a href={href}>{children}</a>
        </Button>
      ) : (
        <Button disabled={isLoading} {...props}>
          {isLoading ? <Spinner /> : icon}
          {children}
        </Button>
      )}
    </>
  );
}

export { AppButton };

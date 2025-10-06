import { Button } from "./ui/button";

type AppCardProps = {
  children: React.ReactNode;
  href?: string;
} & React.ComponentProps<typeof Button>;

export function AppButton({ children, href, ...props }: AppCardProps) {
  return href ? (
    <Button asChild {...props}>
      <a href={href}>{children}</a>
    </Button>
  ) : (
    <Button {...props}>{children}</Button>
  );
}

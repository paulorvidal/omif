import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Spinner } from "./ui/spinner";

type AppCardProps = {
  title: string;
  description?: string;
  type: "info" | "warning" | "error" | "success" | "loading";
  redirectTo?: string;
  redirectMessage?: string;
} & React.ComponentProps<typeof Card>;

function AppCard({
  title,
  description,
  type,
  redirectTo,
  redirectMessage = "Voltar",
  ...props
}: AppCardProps) {
  const navigate = useNavigate();

  const handleRedirect = () => {
    if (redirectTo) {
      navigate(redirectTo, { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <Card className="w-full max-w-sm gap-0" {...props}>
      <CardHeader className="grid-rows-[1fr_auto] gap-4">
        {type == "info" && <Info className="mx-auto size-8 text-blue-600" />}
        {type == "warning" && (
          <CircleAlert className="mx-auto size-8 text-yellow-400" />
        )}
        {type == "error" && (
          <CircleX className="text-destructive mx-auto size-8" />
        )}
        {type == "success" && (
          <CircleCheck className="mx-auto size-8 text-green-500" />
        )}
        {type == "loading" && <Spinner className="mx-auto size-8" />}
        <CardTitle className="text-center">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>

      <CardContent className="text-end">
        <Button variant="link" onClick={handleRedirect}>
          {redirectMessage}
        </Button>
      </CardContent>
    </Card>
  );
}

export { AppCard };

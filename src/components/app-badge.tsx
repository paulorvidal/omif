import { CircleAlert, CircleCheck, CircleX } from "lucide-react";
import { Badge } from "./ui/badge";

type AppBadgeProps = {
  type: string;
  children: string;
};

function AppBadge({ type, children }: AppBadgeProps) {
  if (type == "error")
    return (
      <Badge variant="outline">
        <CircleX className="text-destructive" />
        {children}
      </Badge>
    );
  if (type == "warning")
    return (
      <Badge variant="outline">
        <CircleAlert className="text-yellow-500" />
        {children}
      </Badge>
    );
  if (type == "success")
    return (
      <Badge variant="outline">
        <CircleCheck className="text-green-500" />
        {children}
      </Badge>
    );
}

export { AppBadge };

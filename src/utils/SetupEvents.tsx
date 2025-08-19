import { useEffect } from "react";
import { useNavigate } from "react-router";
import { setRedirectFunction, setToastFunction } from "./events";
import { toast } from "sonner";

export const SetupEvents = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setToastFunction((message, type = "info") => {
      switch (type) {
        case "error":
          toast.error(message);
          break;
        case "warning":
          toast.warning(message);
          break;
        case "success":
          toast.success(message);
          break;
        default:
          toast.info(message);
      }
    });

    setRedirectFunction((path: string) => {
      navigate(path);
    });
  }, [navigate]);

  return null;
};

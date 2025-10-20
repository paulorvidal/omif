import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setRedirectFunction, setToastFunction } from "./events"; 
import { toast } from "sonner"; 

export const SetupEvents = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setRedirectFunction(navigate);

    setToastFunction((message, type) => {
      switch (type) {
        case "success":
          toast.success(message);
          break;
        case "error":
          toast.error(message);
          break;
        case "warning":
          toast.warning(message);
          break;
        default:
          toast.info(message);
      }
    });

    return () => {
      setRedirectFunction(null);
      setToastFunction(null);
    };
  }, [navigate]);

  return null; 
};
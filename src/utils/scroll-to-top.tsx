import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTop } from "./scroll-to-top";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  return null;
};

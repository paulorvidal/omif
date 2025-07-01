import { useEffect, type JSX } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router";
import { toast, Toaster } from "sonner";

import { setRedirectFunction, setToastFunction } from "./utils/events";
import { ScrollToTop } from "./utils/ScrollToTop";

import { Login } from "./pages/Login";
import { Educator } from "./pages/Educator";
import { Student } from "./pages/Student";
import { Dashboard } from "./pages/Dashboard";
import { Institutions } from "./pages/Institutions";
import { Institution } from "./pages/Institution";
import { Students } from "./pages/Students";

const SetupEvents = () => {
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

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" />;
};

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <SetupEvents />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/educador" element={<Educator />} />
          <Route path="/estudante" element={<Student />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/instituicoes"
            element={
              <PrivateRoute>
                <Institutions />
              </PrivateRoute>
            }
          />
          <Route
            path="/instituicao/:id"
            element={
              <PrivateRoute>
                <Institution />
              </PrivateRoute>
            }
          />
          <Route
            path="/instituicao"
            element={
              <PrivateRoute>
                <Institution />
              </PrivateRoute>
            }
          />
          <Route
            path="/estudantes"
            element={
              <PrivateRoute>
                <Students />
              </PrivateRoute>
            }
          />
        </Routes>
        <Toaster richColors />
      </BrowserRouter>
    </>
  );
};

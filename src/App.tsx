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
import { Edition } from "./pages/Edition";
import { Editions } from "./pages/Editions";
import { Notice } from "./pages/Notice";
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { PasswordRecoveryPage } from "./pages/PasswordRecoveryPage"
import { Educators } from "./pages/Educators";
import { Steps } from "./pages/Steps";
import { Profile } from "./pages/Profile"


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

const PrivateRoute = ({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles?: string[];
}) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  if (!token) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles && allowedRoles.length > 0) {
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/login" />;
    }
  }
  return children;
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
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
          <Route path="/password-recovery/:token" element={<PasswordRecoveryPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/aviso"
            element={
              <PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
                <Notice />
              </PrivateRoute>
            }
          />
          <Route
            path="/instituicoes"
            element={
              <PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
                <Institutions />
              </PrivateRoute>
            }
          />
          <Route
            path="/instituicao/:id"
            element={
              <PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
                <Institution />
              </PrivateRoute>
            }
          />
          <Route
            path="/instituicao"
            element={
              <PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
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
          <Route
            path="/edicoes"
            element={
              <PrivateRoute>
                <Editions />
              </PrivateRoute>
            }
          />
          <Route
            path="/edicao"
            element={
              <PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
                <Edition />
              </PrivateRoute>
            }
          />
          <Route
            path="/etapas/:id"
            element={
              <PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
                <Steps />
              </PrivateRoute>
            }
          />
          <Route
            path="/educadores"
            element={
              <PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
                <Educators />
              </PrivateRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
        <Toaster richColors />
      </BrowserRouter>
    </>
  );
};

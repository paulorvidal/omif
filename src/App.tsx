import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { useEffect, type JSX } from "react";
import { StudentRegister } from "./components/register/StudentRegister";
import { Register } from "./pages/Register";
import { toast, Toaster } from "sonner";
import { ScrollToTop } from "./utils/ScrollToTop";
import { setRedirectFunction, setToastFunction } from "./utils/events";

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
          <Route path="/" element={<Navigate to="/login" />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/cadastre-se" element={<Register />}></Route>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          ></Route>
          <Route path="/student-register" element={<StudentRegister />}></Route>
        </Routes>
        <Toaster richColors />
      </BrowserRouter>
    </>
  );
};

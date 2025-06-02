import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import type { JSX } from "react";
import { StudentRegister } from "./components/register/StudentRegister";
import { Register } from "./pages/Register";
import { Toaster } from "sonner";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" />;
};

export const App = () => {
  return (
    <>
      <BrowserRouter>
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
      </BrowserRouter>{" "}
      <Toaster richColors />
    </>
  );
};

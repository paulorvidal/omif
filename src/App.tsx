import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import type { JSX } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" />;
};

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
};

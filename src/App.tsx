import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Toaster } from "sonner";

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
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { PasswordRecoveryPage } from "./pages/PasswordRecoveryPage";
import { Educators } from "./pages/Educators";
import { Steps } from "./pages/Steps";
import { Profile } from "./pages/Profile"
import { MainLayout } from "./components/ui/MainLayout";

import { SetupEvents } from "./utils/SetupEvents";
import { PrivateRoute } from "./utils/PrivateRoute";

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
          <Route
            path="/password-recovery/:token"
            element={<PasswordRecoveryPage />}
          />

          <Route
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
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
          </Route>
        </Routes>
        <Toaster richColors />
      </BrowserRouter>
    </>
  );
};

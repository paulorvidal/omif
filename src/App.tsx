import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { RootLayout } from "./components/layout/RootLayout";
import { Login } from "./pages/Login";
import { EducatorForm } from "./components/form/EducatorForm";
import { MainLayout } from "./components/layout/MainLayout";
import { PrivateRoute } from "./utils/PrivateRoute";
import { Notices } from "./pages/Notices";
import { NoticeForm } from "./components/form/NoticeForm";
import { InstitutionForm } from "./components/form/InstitutionForm";
import { EducatorTable } from "./components/table/EducatorTable";
import { EditionForm } from "./components/form/EditionForm";
import { EditionTable } from "./components/table/EditionTable";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { PasswordRecoveryPage } from "./pages/PasswordRecoveryPage";
import { StepsForm } from "./components/form/StepsForm";
import { Profile } from "./pages/Profile";
import { EnrollmentInstitutionForm } from "./components/form/EnrollmentInstitutionForm";

import { InstitutionsPage } from "./pages/InstitutionsPage";
import { StudentsPage } from "./pages/StudentsPage"
import { EnrollmentStudentPage } from "./pages/EnrollmentStudentPage"

import { StudentEditForm } from "./components/form/StudentEditForm"

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/educador",
        element: <EducatorForm />,
      },
      {
        path: "/edicoes/:editionYear/estudantes",
        element: <EnrollmentStudentPage />,
      },
      {
        path: "/verify-email/:token",
        element: <VerifyEmailPage />,
      },
      {
        path: "/password-recovery/:token",
        element: <PasswordRecoveryPage />,
      },
      {
        element: (
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        ),
        children: [
          {
            path: "/avisos",
            element: <Notices />,
            handle: { title: "Avisos", showBackButton: false },
          },
          {
            path: "/aviso",
            element: (
              <PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
                <NoticeForm />
              </PrivateRoute>
            ),
            handle: { title: "Aviso" },
          },
          {
            path: "/instituicoes",
            element: (
              <PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
                <InstitutionsPage />
              </PrivateRoute>
            ),
            handle: { title: "Instituições" },
          },
          {
            path: "/instituicao/:id",
            element: (
              <PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
                <InstitutionForm />
              </PrivateRoute>
            ),
            handle: { title: "Editar Instituição" },
          },
          {
            path: "/instituicao",
            element: (
              <PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
                <InstitutionForm />
              </PrivateRoute>
            ),
            handle: { title: "Nova Instituição" },
          },
          {
            path: "/estudantes",
            element: (
              <PrivateRoute>
                <StudentsPage />
              </PrivateRoute>
            ),
            handle: { title: "Estudantes" },
          },
          {
            path: "/estudantes/:id",
            element: (
              <PrivateRoute>
                <StudentEditForm />
              </PrivateRoute>
            ),
            handle: { title: "Editar Estudante" },
          },
          {
            path: "/edicoes",
            element: (
              <PrivateRoute>
                <EditionTable />
              </PrivateRoute>
            ),
            handle: { title: "Edições" },
          },
          {
            path: "/edicao",
            element: (
              <PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
                <EditionForm />
              </PrivateRoute>
            ),
            handle: { title: "Nova Edição" },
          },
          {
            path: "/edicao/:id",
            element: (
              <PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
                <EditionForm />
              </PrivateRoute>
            ),
            handle: { title: "Editar Edição" },
          },
          {
            path: "/edicoes/:id/etapas",
            element: (
              <PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
                <StepsForm />
              </PrivateRoute>
            ),
            handle: { title: "Etapas" },
          },
          {
            path: "/educadores",
            element: (
              <PrivateRoute allowedRoles={["ADMINISTRADOR"]}>
                <EducatorTable />
              </PrivateRoute>
            ),
            handle: { title: "Educadores" },
          },
          {
            path: "/perfil",
            element: (
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            ),
            handle: { title: "Perfil" },
          },
          {
            path: "/edicoes/:editionYear/inscrever-instituicao",
            element: (
              <PrivateRoute>
                <EnrollmentInstitutionForm />
              </PrivateRoute>
            ),
            handle: { title: "Inscrever Instituição" },
          },
        ],
      },
    ],
  },
]);

export const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors />
    </>
  );
};
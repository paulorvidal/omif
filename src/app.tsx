import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { Toaster } from "sonner";
import { RootLayout } from "./components/layout/root-layout";
import { MainLayout } from "./components/layout/main-layout";

import { Form } from "./pages/preview/form";
import { Table } from "./pages/preview/table";
import { LoginForm } from "./pages/login-form";
import { InstitutionsPage } from "./pages/institution-page";
import { EditionsPage } from "./pages/edition-page";
import { StudentsPage } from "./pages/student-page";

import { EnrollmentStudentForm } from "./pages/enrollment-student-form";
import { EducatorForm } from "./pages/educator-form";
import { InstitutionForm } from "./pages/institution-form";
import { EnrollmentInstitutionForm } from "./pages/enrollment-institution-form";

import { EditionForm } from "./pages/edition-form";
import { StepForm } from "./pages/step-form";

import { ProfileForm } from "./pages/profile-form";
import { PrivateRoute } from "./components/private-route";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" />,
      },
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/form",
        element: <Form />,
      },
      {
        element: (
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        ),
        children: [
          {
            path: "/table",
            element: <Table />,
          },
          {
            path: "/instituicao",
            element: <InstitutionForm />,
          },
          {
            path: "/perfil",
            element: <ProfileForm />,
          },
          {
            path: "/instituicao/:id",
            element: <InstitutionForm />,
          },
          {
            path: "/edicao",
            element: <EditionForm />,
          },
          {
            path: "/edicao/:id",
            element: <EditionForm />,
          },
          {
            path: "/edicoes/:editionYear/instituicao-inscricao",
            element: <EnrollmentInstitutionForm />,
          },
          {
            path: "/edicao/:editionId/etapa",
            element: <StepForm />,
          },
          {
            path: "/edicao/:editionId/etapa/:stepId",
            element: <StepForm />,
          },
          {
            path: "/instituicoes",
            element: <InstitutionsPage />,
          },
          {
            path: "/estudantes",
            element: <StudentsPage />,
          },
          {
            path: "/edicoes",
            element: <EditionsPage />,
          },
        ],
      },
      {
        path: "/edicoes/:editionYear/estudantes-inscricao",
        element: <EnrollmentStudentForm />,
      },
      {
        path: "/educador",
        element: <EducatorForm />,
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

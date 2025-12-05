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

import { EnrollmentStudentForm } from "./pages/enrollment-student-form";
import { EducatorForm } from "./pages/educator-form";
import { InstitutionForm } from "./pages/institution-form";
import { PrivateRoute } from "./utils/private-route";
import { ProfileForm } from "./pages/profile-form";

import { EditionForm } from "./pages/edition-form";
import { StepForm } from "./pages/step-form";

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

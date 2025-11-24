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

import { EnrollmentStudentForm } from "./pages/enrollment-student-form";
import { EducatorForm } from "./pages/educator-form";
import { InstitutionForm } from "./pages/institution-form";
import { PrivateRoute } from "./utils/private-route";
import { ProfileForm } from "./pages/profile-form";

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
      {
        element: <MainLayout />,
        children: [
          {
            path: "/instituicoes",
            element: <InstitutionsPage />,
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

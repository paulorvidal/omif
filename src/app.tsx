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
import { EducatorSignUpPage } from "./pages/educator/EducatorSignUpPage";


import { EnrollmentStudentForm } from "./pages/enrollment-student-form";

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
        path: "/cadastrar",
        element: <EducatorSignUpPage />,
      },
      {
        element: (
          //<PrivateRoute>
          <MainLayout />
          //</PrivateRoute>
        ),
        children: [
          {
            path: "/table",
            element: <Table />,
          },
        ],
      },
      {
        path: "/edicoes/:editionYear/estudantes-inscricao",
        element: <EnrollmentStudentForm />,
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

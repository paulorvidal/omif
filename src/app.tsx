import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from "sonner";
import { RootLayout } from "./components/layout/root-layout";
import { PrivateRoute } from "./utils/private-route";
import { MainLayout } from "./components/layout/main-layout";
import { Form } from "./pages/preview/form";
import { Table } from "./pages/preview/table";
import { Login } from "./pages/login";

import { EnrollmentStudentForm } from "./pages/enrrolmentstudent/enrollment-student-form";

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
        element: <Login />,
      },
      {
        path: "/form",
        element: <Form />,
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

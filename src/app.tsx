import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { RootLayout } from "./components/layout/root-layout";
import { PrivateRoute } from "./utils/private-route";
import { MainLayout } from "./components/layout/main-layout";
import { Form } from "./pages/form";
import { Table } from "./pages/table";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
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

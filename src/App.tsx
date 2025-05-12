import { BrowserRouter, Route, Routes } from "react-router";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";

//const PrivateRoute = ({children}:{children: JSX.Element})

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

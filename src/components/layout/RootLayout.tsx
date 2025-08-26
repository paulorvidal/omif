import { Outlet } from "react-router-dom";
import { SetupEvents } from "../../utils/SetupEvents";

export const RootLayout = () => {
  return (
    <>
      <SetupEvents />
      
      <Outlet />
    </>
  );
};
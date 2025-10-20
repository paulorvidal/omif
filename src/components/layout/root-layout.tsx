import { Outlet } from "react-router-dom";
import { SetupEvents } from "../../utils/setup-events";

function RootLayout() {
  return (
    <>
      <SetupEvents />

      <Outlet />
    </>
  );
}

export { RootLayout };

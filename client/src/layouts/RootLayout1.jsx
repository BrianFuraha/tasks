import { Outlet } from "react-router-dom";
import { Nav } from "../components";

export default function RootLayout2() {
  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  );
}

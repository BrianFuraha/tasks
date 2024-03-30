import { Outlet } from "react-router-dom";

import { Footer, Navbar, Nav } from "../components";

export default function RootLayout() {
  return (
    <div>
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
}

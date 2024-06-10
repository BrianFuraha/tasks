import { Outlet } from "react-router-dom";

export default function RootLayout2() {
  return (
    <div className="hide-scrollbar">
      <Outlet />
    </div>
  );
}

import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import { RootLayout, RootLayout2 } from "./layouts";
import { Home, How, Why, SignIn, SignUp, Runner } from "./pages";

const routes = (
  <>
    <Route element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="/how" element={<How />} />
      <Route path="/why" element={<Why />} />
    </Route>
    <Route element={<RootLayout2 />}>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/runner" element={<Runner />} />
    </Route>
  </>
);

const router = createBrowserRouter(createRoutesFromElements(routes));

export default function App() {
  return <RouterProvider router={router} />;
}

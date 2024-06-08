import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import { RootLayout, RootLayout1, RootLayout2 } from "./layouts";
import {
  Home,
  How,
  Why,
  SignIn,
  SignUp,
  Land,
  Profile,
  Runner,
  Messages,
  Runsign,
  ProfileCard,
  RunnerProfile,
} from "./pages";

const routes = (
  <>
    <Route element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="/how" element={<How />} />
      <Route path="/why" element={<Why />} />
    </Route>
    <Route element={<RootLayout1 />}>
      <Route path="/hero" element={<Land />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/runners" element={<Runner />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/myProfile" element={<ProfileCard />} />
      <Route path="/runnerProfile/:userId" element={<RunnerProfile />} />
    </Route>
    <Route element={<RootLayout2 />}>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/runner-signup" element={<Runsign />} />
    </Route>
  </>
);

const router = createBrowserRouter(createRoutesFromElements(routes));

export default function App() {
  return <RouterProvider router={router} />;
}

import React from 'react'
import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';

export default function Auction() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  return currentUser.userType == "runner" ? (
    <div>
      <h1>Auction</h1>

      <h2>runner home</h2>
    </div>
  ) : (
    <Navigate to="/hero" />
  );
}

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from "./Navbar"; // Import the Navbar for layout

const ProtectedRoute = ({ permission, children }) => {
  const { user, permissions } = useAuth();

  if (!user) {
    alert("You are not authenticated. Please log in first.");
    return <Navigate to="/login" replace/>;
  }

  if (permission && permissions.length == 0 ){
    alert("You dont have any permissions. Please request permissions!");
    return <Navigate to="/" replace/>;
  }

  if (permission && !permissions.includes(permission)) {
    alert("You are not authorized to access this page.");
    return <Navigate to="/" replace/>; // Redirect to home or an "unauthorized" page
  }

  return (
    <>
      <Navbar /> {/* Authenticated Layout */}
      <main>{children}</main>
    </>
  );
};

export default ProtectedRoute;

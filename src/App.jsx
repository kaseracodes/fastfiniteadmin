import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Navbar from "./Navbar"; // Import Navbar component
import Login from "./Login";
import AddVehicle from "./AddVehicle";
import BookingsList from "./BookingsList";
import UsersList from "./UsersList";
import VehiclesList from "./VehiclesList";
import UpdateVehicle from "./UpdateVehicle";
import Home from "./Home";
import Signup from "./Signup";

// A layout wrapper for authenticated pages
const AuthenticatedLayout = ({ children }) => {
  return (
    <>
      <Navbar /> {/* Include Navbar */}
      <main>{children}</main>
    </>
  );
};

// A ProtectedRoute that redirects unauthenticated users to the login page
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes with Authenticated Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Home />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/addvehicle"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <AddVehicle />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <BookingsList />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <UsersList />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <VehiclesList />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/updatevehicle/:id"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <UpdateVehicle />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

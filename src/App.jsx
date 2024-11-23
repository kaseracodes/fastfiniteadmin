import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import AddVehicle from "./AddVehicle";
import BookingsList from "./BookingsList";
import UsersList from "./UsersList";
import VehiclesList from "./VehiclesList";
import UpdateVehicle from "./UpdateVehicle";
import AdminList from "./AdminList";
import UpdatePermissions from "./UpdatePermissions";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addvehicle"
            element={
              <ProtectedRoute permission="add_vehicle">
                <AddVehicle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute permission="view_bookings">
                <BookingsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute permission="view_users">
                <UsersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles"
            element={
              <ProtectedRoute permission="view_vehicle">
                <VehiclesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updatevehicle/:id"
            element={
              <ProtectedRoute permission="update_vehicle">
                <UpdateVehicle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins"
            element={
              <ProtectedRoute permission="view_admins">
                  <AdminList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updatepermissions/:id"
            element={
              <ProtectedRoute permission="update_permissions">
                  <UpdatePermissions />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

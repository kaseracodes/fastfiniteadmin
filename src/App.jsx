import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AddVehicle from "./AddVehicle";
import BookingsList from "./BookingsList";
import UsersList from "./UsersList";
import VehiclesList from "./VehiclesList";
import UpdateVehicle from "./UpdateVehicle";
import Home from "./Home";

const SECURITY_KEY = "mySecureCode123"; // Replace with your hardcoded security key

const ProtectedRoute = ({ children }) => {
  const [securityInput, setSecurityInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleSecurityCheck = (e) => {
    e.preventDefault();
    if (securityInput === SECURITY_KEY) {
      setIsAuthorized(true);
    } else {
      alert("Incorrect security key. Please try again.");
    }
  };

  if (isAuthorized) {
    return children;
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Enter Security Key</h2>
      <form onSubmit={handleSecurityCheck}>
        <input
          type="password"
          placeholder="Enter security key"
          value={securityInput}
          onChange={(e) => setSecurityInput(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addvehicle" element={<ProtectedRoute><AddVehicle/></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><BookingsList/></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><UsersList/></ProtectedRoute>} />
        <Route path="/vehicles" element={ <ProtectedRoute><VehiclesList/></ProtectedRoute>} />
        <Route path="/updatevehicle/:id" element={ <ProtectedRoute><UpdateVehicle/></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddVehicle from "./AddVehicle";
import BookingsList from "./BookingsList"
import UsersList from "./UsersList"
import VehiclesList from "./VehiclesList";
import UpdateVehicle from './UpdateVehicle';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/addvehicle" element={<AddVehicle />} />
        <Route path="/bookings" element={<BookingsList />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/vehicles" element={<VehiclesList />} />
        <Route path="/updatevehicle/:id" element={<UpdateVehicle />} />
        {/* <Route path="/admin" element={<AdminPanel />} /> */}
      </Routes>
    </Router>
  );
};

export default App;

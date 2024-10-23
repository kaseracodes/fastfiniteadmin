import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore'; // Firestore functions
import { db } from './firebaseConfig'; // Adjust the path to your Firebase configuration
import './BookingsList.css'; // Import the CSS file

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [userMap, setUserMap] = useState(new Map());
  const [vehicleMap, setVehicleMap] = useState(new Map());

  // Fetch all users and map them by id, storing the full object
  const fetchUsers = async () => {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const usersData = new Map();
    usersSnapshot.forEach((doc) => {
      usersData.set(doc.id, doc.data()); // Map user ID to the full object
    });
    setUserMap(usersData);
  };

  // Fetch all vehicles and map them by id, storing the full object
  const fetchVehicles = async () => {
    const vehiclesSnapshot = await getDocs(collection(db, 'vehicles'));
    const vehiclesData = new Map();
    vehiclesSnapshot.forEach((doc) => {
      vehiclesData.set(doc.id, doc.data()); // Map vehicle ID to the full object
    });
    setVehicleMap(vehiclesData);
  };

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc')); // Order by createdAt (newest first)
      const querySnapshot = await getDocs(q);
      const bookingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(bookingsData);
      // alert('Bookings successfully fetched!');
    } catch (error) {
      console.error('Error fetching bookings: ', error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts
    fetchVehicles(); // Fetch vehicles when the component mounts
    fetchBookings(); // Fetch bookings when the component mounts
  }, []);

  return (
    <div className="bookings-list-container">
      <h2 className="bookings-heading">Bookings List</h2>
      <table className="bookings-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Created At</th>
            <th>Vehicle Name</th>
            <th>User Name</th>
            <th>Amount (₹)</th>
            <th>Deposit (₹)</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="booking-row">
              <td>{booking.orderId}</td>
              <td>{new Date(booking.createdAt).toLocaleString()}</td>
              <td>{vehicleMap.get(booking.vehicle_id)?.name || 'Unknown Vehicle'}</td> {/* Fetch vehicle name */}
              <td>{userMap.get(booking.uid)?.name || 'Unknown User'}</td> {/* Fetch user name */}
              <td>{booking.amount}</td>
              <td>{booking.deposit}</td>
              <td>{new Date(booking.startTime).toLocaleString()}</td>
              <td>{new Date(booking.endTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsList;

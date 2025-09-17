import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const Home = () => {
  const { permissions } = useAuth(); // get logged in admin’s permissions
  const [bookingsEnabled, setBookingsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const hasPermission = permissions.includes('toggle_bookings');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'global');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setBookingsEnabled(snap.data().bookingsEnabled);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = async () => {
    if (!hasPermission) {
      alert("You don't have permission to change booking settings");
      return;
    }

    try {
      const docRef = doc(db, 'settings', 'global');
      await updateDoc(docRef, { bookingsEnabled: !bookingsEnabled });
      setBookingsEnabled(!bookingsEnabled);
    } catch (err) {
      console.error('Error updating setting:', err);
      alert('Failed to update booking setting');
    }
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div className="home-container">
      <h1>Admin Panel</h1>

      {/* 🔥 Booking toggle */}
      <div className="toggle-container">
        <label className="switch">
          <input
            type="checkbox"
            checked={bookingsEnabled}
            onChange={handleToggle}
            disabled={!hasPermission} // only allowed if permission
          />
          <span className="slider round"></span>
        </label>
        <span style={{ marginLeft: '10px' }}>
          Bookings are {bookingsEnabled ? 'ENABLED' : 'DISABLED'}
        </span>
      </div>

      <div className="bento-grid">
        <Link to="/addvehicle" className="bento-item">
          <button>Add Vehicle</button>
        </Link>
        <Link to="/vehicles" className="bento-item">
          <button>View Vehicles</button>
        </Link>
        <Link to="/bookings" className="bento-item">
          <button>View Bookings</button>
        </Link>
        <Link to="/users" className="bento-item">
          <button>View Users</button>
        </Link>
        <Link to="/admins" className="bento-item">
          <button>View Admins</button>
        </Link>
        <Link to="/banners" className="bento-item">
          <button>Banners</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
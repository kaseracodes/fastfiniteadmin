import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Admin Panel</h1>
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
      </div>
    </div>
  );
};

export default Home;

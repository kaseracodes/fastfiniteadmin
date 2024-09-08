import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { db } from "./firebaseConfig"; // Adjust path for Firebase config
import './VehiclesList.css';

const PetrolScootersTable = ({ vehicles }) => (
  <table className="vehicles-table">
    <thead>
      <tr>
        {/* All the table headers */}
        <th>ID</th>
        <th>Image</th>
        <th>Name</th>
        <th>Brand</th>
        <th>City</th>
        <th>Pickup Point</th>
        <th>Position</th>
        <th>Make Year</th>
        <th>Top Speed</th>
        <th>Kerb Weight</th>
        <th>Seats</th>
        <th>Mileage</th>
        <th>Displacement</th>
        <th>Fuel Tank Capacity</th>
        <th>Late Penalty</th>
        <th>Daily Price</th>
        <th>Daily Deposit</th>
        <th>Weekly Price</th>
        <th>Weekly Deposit</th>
        <th>Monthly Price</th>
        <th>Monthly Deposit</th>
      </tr>
    </thead>
    <tbody>
      {vehicles.map((vehicle) => (
        <tr key={vehicle.id}>
          <td>{vehicle.id}</td>
          <td>
            <img src={vehicle.image} alt={vehicle.name} className="vehicle-image" />
          </td>
          <td>{vehicle.name}</td>
          <td>{vehicle.brand}</td>
          <td>{vehicle.city}</td>
          <td>{vehicle.pickup_point}</td>
          <td>{vehicle.position.join(", ")}</td>
          <td>{vehicle.make_year}</td>
          <td>{vehicle.top_speed}</td>
          <td>{vehicle.kerb_weight}</td>
          <td>{vehicle.seats}</td>
          <td>{vehicle.mileage}</td>
          <td>{vehicle.displacement}</td>
          <td>{vehicle.fuel_tank_capacity}</td>
          <td>{vehicle.late_penalty}</td>
          <td>{vehicle.package.daily.price}</td>
          <td>{vehicle.package.daily.deposit}</td>
          <td>{vehicle.package.weekly.price}</td>
          <td>{vehicle.package.weekly.deposit}</td>
          <td>{vehicle.package.monthly.price}</td>
          <td>{vehicle.package.monthly.deposit}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const PetrolBikesTable = ({ vehicles }) => (
  <table className="vehicles-table">
    <thead>
      <tr>
        {/* All the table headers */}
        <th>ID</th>
        <th>Image</th>
        <th>Name</th>
        <th>Brand</th>
        <th>City</th>
        <th>Pickup Point</th>
        <th>Position</th>
        <th>Make Year</th>
        <th>Top Speed</th>
        <th>Kerb Weight</th>
        <th>Seats</th>
        <th>Mileage</th>
        <th>Displacement</th>
        <th>Fuel Tank Capacity</th>
        <th>Late Penalty</th>
        <th>Daily Price</th>
        <th>Daily Deposit</th>
        <th>Weekly Price</th>
        <th>Weekly Deposit</th>
        <th>Monthly Price</th>
        <th>Monthly Deposit</th>
      </tr>
    </thead>
    <tbody>
      {vehicles.map((vehicle) => (
        <tr key={vehicle.id}>
          <td>{vehicle.id}</td>
          <td>
            <img src={vehicle.image} alt={vehicle.name} className="vehicle-image" />
          </td>
          <td>{vehicle.name}</td>
          <td>{vehicle.brand}</td>
          <td>{vehicle.city}</td>
          <td>{vehicle.pickup_point}</td>
          <td>{vehicle.position.join(", ")}</td>
          <td>{vehicle.make_year}</td>
          <td>{vehicle.top_speed}</td>
          <td>{vehicle.kerb_weight}</td>
          <td>{vehicle.seats}</td>
          <td>{vehicle.mileage}</td>
          <td>{vehicle.displacement}</td>
          <td>{vehicle.fuel_tank_capacity}</td>
          <td>{vehicle.late_penalty}</td>
          <td>{vehicle.package.daily.price}</td>
          <td>{vehicle.package.daily.deposit}</td>
          <td>{vehicle.package.weekly.price}</td>
          <td>{vehicle.package.weekly.deposit}</td>
          <td>{vehicle.package.monthly.price}</td>
          <td>{vehicle.package.monthly.deposit}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const EScootersTable = ({ vehicles }) => (
  <table className="vehicles-table">
    <thead>
      <tr>
        {/* All the table headers */}
        <th>ID</th>
        <th>Image</th>
        <th>Name</th>
        <th>Brand</th>
        <th>City</th>
        <th>Pickup Point</th>
        <th>Position</th>
        <th>Make Year</th>
        <th>Top Speed</th>
        <th>Kerb Weight</th>
        <th>Seats</th>
        <th>Range</th>
        <th>Battery Capacity</th>
        <th>Charging Time</th>
        <th>Late Penalty</th>
        <th>Daily Price</th>
        <th>Daily Deposit</th>
        <th>Weekly Price</th>
        <th>Weekly Deposit</th>
        <th>Monthly Price</th>
        <th>Monthly Deposit</th>
      </tr>
    </thead>
    <tbody>
      {vehicles.map((vehicle) => (
        <tr key={vehicle.id}>
          <td>{vehicle.id}</td>
          <td>
            <img src={vehicle.image} alt={vehicle.name} className="vehicle-image" />
          </td>
          <td>{vehicle.name}</td>
          <td>{vehicle.brand}</td>
          <td>{vehicle.city}</td>
          <td>{vehicle.pickup_point}</td>
          <td>{vehicle.position.join(", ")}</td>
          <td>{vehicle.make_year}</td>
          <td>{vehicle.top_speed}</td>
          <td>{vehicle.kerb_weight}</td>
          <td>{vehicle.seats}</td>
          <td>{vehicle.range}</td>
          <td>{vehicle.battery_capacity}</td>
          <td>{vehicle.charging_time}</td>
          <td>{vehicle.late_penalty}</td>
          <td>{vehicle.package.daily.price}</td>
          <td>{vehicle.package.daily.deposit}</td>
          <td>{vehicle.package.weekly.price}</td>
          <td>{vehicle.package.weekly.deposit}</td>
          <td>{vehicle.package.monthly.price}</td>
          <td>{vehicle.package.monthly.deposit}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const PremiumBikesTable = ({ vehicles }) => (
  <table className="vehicles-table">
    <thead>
      <tr>
        {/* All the table headers */}
        <th>ID</th>
        <th>Image</th>
        <th>Name</th>
        <th>Brand</th>
        <th>City</th>
        <th>Pickup Point</th>
        <th>Position</th>
        <th>Make Year</th>
        <th>Top Speed</th>
        <th>Kerb Weight</th>
        <th>Seats</th>
        <th>Mileage</th>
        <th>Displacement</th>
        <th>Fuel Tank Capacity</th>
        <th>Late Penalty</th>
        <th>Hourly Price</th>
        <th>Hourly Deposit</th>
        <th>Daily Price</th>
        <th>Daily Deposit</th>
        <th>Weekly Price</th>
        <th>Weekly Deposit</th>
        <th>Monthly Price</th>
        <th>Monthly Deposit</th>
      </tr>
    </thead>
    <tbody>
      {vehicles.map((vehicle) => (
        <tr key={vehicle.id}>
          <td>{vehicle.id}</td>
          <td>
            <img src={vehicle.image} alt={vehicle.name} className="vehicle-image" />
          </td>
          <td>{vehicle.name}</td>
          <td>{vehicle.brand}</td>
          <td>{vehicle.city}</td>
          <td>{vehicle.pickup_point}</td>
          <td>{vehicle.position.join(", ")}</td>
          <td>{vehicle.make_year}</td>
          <td>{vehicle.top_speed}</td>
          <td>{vehicle.kerb_weight}</td>
          <td>{vehicle.seats}</td>
          <td>{vehicle.mileage}</td>
          <td>{vehicle.displacement}</td>
          <td>{vehicle.fuel_tank_capacity}</td>
          <td>{vehicle.late_penalty}</td>
          <td>{vehicle.package.hourly.price}</td>
          <td>{vehicle.package.hourly.deposit}</td>
          <td>{vehicle.package.daily.price}</td>
          <td>{vehicle.package.daily.deposit}</td>
          <td>{vehicle.package.weekly.price}</td>
          <td>{vehicle.package.weekly.deposit}</td>
          <td>{vehicle.package.monthly.price}</td>
          <td>{vehicle.package.monthly.deposit}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const VehiclesList = () => {
  const [petrolScooters, setPetrolScooters] = useState([]);
  const [petrolBikes, setPetrolBikes] = useState([]);
  const [premiumBikes, setPremiumBikes] = useState([]);
  const [eScooters, setEScooters] = useState([]);

  // Fetch all vehicles from Firestore and categorize them by type
  const fetchVehicles = async () => {
    try {
      const vehiclesSnapshot = await getDocs(collection(db, "vehicles"));
      const vehiclesData = vehiclesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Categorize the vehicles based on type
      const petrolScooters = vehiclesData.filter(vehicle => vehicle.type === "petrolScooter");
      const petrolBikes = vehiclesData.filter(vehicle => vehicle.type === "petrolBike");
      const premiumBikes = vehiclesData.filter(vehicle => vehicle.type === "premiumBike");
      const eScooters = vehiclesData.filter(vehicle => vehicle.type === "eScooter");

      setPetrolScooters(petrolScooters);
      setPetrolBikes(petrolBikes);
      setPremiumBikes(premiumBikes);
      setEScooters(eScooters);
    } catch (error) {
      console.error("Error fetching vehicles: ", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);


  return (
    <div className="vehicles-list">

      <h2>E-Scooters</h2>
      <EScootersTable vehicles={eScooters} />

      <h2>Petrol Scooters</h2>
      <PetrolScootersTable vehicles={petrolScooters} />

      <h2>Petrol Bikes</h2>
      <PetrolBikesTable vehicles={petrolBikes} />

      <h2>Premium Bikes</h2>
      <PremiumBikesTable vehicles={premiumBikes} />
    </div>
  );
};

export default VehiclesList;

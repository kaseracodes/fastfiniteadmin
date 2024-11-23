import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from "./firebaseConfig"; // Adjust path for Firebase config
import { useAuth } from "./AuthContext";
import './VehiclesList.css';

const PetrolScootersTable = ({ vehicles }) => {

  const navigate = useNavigate();
  const {permissions} = useAuth();

  const handleUpdate = (id) => {
    navigate(`/updatevehicle/${id}`);
  };
  const handleDelete = async (id) => {
    if ( !permissions.includes('delete_vehicle')){
      alert("You dont have the necessary permission to delete an vehicle");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this vehicle?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "vehicles", id)); // Deleting the vehicle document from Firestore
        alert("Vehicle deleted successfully");
        // Optionally, you can refresh the list of vehicles after deletion
        window.location.reload(); // Simple way to reload data after delete
      } catch (error) {
        console.error("Error deleting vehicle: ", error);
        alert("Failed to delete the vehicle. Please try again.");
      }
    }
  };

  return (
    <table className="vehicles-table">
      <thead>
        <tr>
          {/* All the table headers */}
          <th></th>
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
            <td> 
              <button onClick={() => handleUpdate(vehicle.id)}>Update</button> 
              <button onClick={() => handleDelete(vehicle.id)} className="delete-btn">Delete</button>
            </td>
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
}

const PetrolBikesTable = ({ vehicles }) => {

  const navigate = useNavigate();
  const {permissions} = useAuth();

  const handleUpdate = (id) => {
    navigate(`/updatevehicle/${id}`);
  };
  const handleDelete = async (id) => {
    if ( !permissions.includes('delete_vehicle')){
      alert("You dont have the necessary permission to delete an vehicle");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this vehicle?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "vehicles", id)); // Deleting the vehicle document from Firestore
        alert("Vehicle deleted successfully");
        // Optionally, you can refresh the list of vehicles after deletion
        window.location.reload(); // Simple way to reload data after delete
      } catch (error) {
        console.error("Error deleting vehicle: ", error);
        alert("Failed to delete the vehicle. Please try again.");
      }
    }
  };

  return (
    <table className="vehicles-table">
      <thead>
        <tr>
          {/* All the table headers */}
          <th></th>
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
            <td> 
              <button onClick={() => handleUpdate(vehicle.id)}>Update</button> 
              <button onClick={() => handleDelete(vehicle.id)} className="delete-btn">Delete</button>
            </td>
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
}

const EScootersTable = ({ vehicles }) => {
  
  const navigate = useNavigate();
  const {permissions} = useAuth();

  const handleUpdate = (id) => {
    navigate(`/updatevehicle/${id}`);
  };
  const handleDelete = async (id) => {
    if ( !permissions.includes('delete_vehicle')){
      alert("You dont have the necessary permission to delete an vehicle");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this vehicle?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "vehicles", id)); // Deleting the vehicle document from Firestore
        alert("Vehicle deleted successfully");
        // Optionally, you can refresh the list of vehicles after deletion
        window.location.reload(); // Simple way to reload data after delete
      } catch (error) {
        console.error("Error deleting vehicle: ", error);
        alert("Failed to delete the vehicle. Please try again.");
      }
    }
  };

  return (
    <table className="vehicles-table">
      <thead>
        <tr>
          {/* All the table headers */}
          <th></th>
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
            <td> 
              <button onClick={() => handleUpdate(vehicle.id)}>Update</button> 
              <button onClick={() => handleDelete(vehicle.id)} className="delete-btn">Delete</button>
            </td>
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
}

const PremiumBikesTable = ({ vehicles }) => {
  
  const navigate = useNavigate();
  const {permissions} = useAuth();
  
  const handleUpdate = (id) => {
    navigate(`/updatevehicle/${id}`);
  };
  const handleDelete = async (id) => {
    if ( !permissions.includes('delete_vehicle')){
      alert("You dont have the necessary permission to delete an vehicle");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this vehicle?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "vehicles", id)); // Deleting the vehicle document from Firestore
        alert("Vehicle deleted successfully");
        // Optionally, you can refresh the list of vehicles after deletion
        window.location.reload(); // Simple way to reload data after delete
      } catch (error) {
        console.error("Error deleting vehicle: ", error);
        alert("Failed to delete the vehicle. Please try again.");
      }
    }
  };

  return (
    <table className="vehicles-table">
      <thead>
        <tr>
          {/* All the table headers */}
          <th></th>
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
            <td> 
              <button onClick={() => handleUpdate(vehicle.id)}>Update</button> 
              <button onClick={() => handleDelete(vehicle.id)} className="delete-btn">Delete</button>
            </td>
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
            {/* <td>{vehicle.package.hourly.price}</td>
            <td>{vehicle.package.hourly.deposit}</td> */}
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
}

const VehiclesList = () => {
  const [petrolScooters, setPetrolScooters] = useState([]);
  const [petrolBikes, setPetrolBikes] = useState([]);
  const [premiumBikes, setPremiumBikes] = useState([]);
  const [eScooters, setEScooters] = useState([]);
  const navigate = useNavigate();

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

      console.log(premiumBikes);

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

  const handleUpdate = (id) => {
    navigate(`/updatevehicle/${id}`);
  };

  return (
    <div className="vehicles-list">

      <h2>E-Scooters</h2>
      <EScootersTable vehicles={eScooters}/>

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

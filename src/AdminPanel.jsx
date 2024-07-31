import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import { db, storage } from "./firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import './AdminPanel.css';

const AdminPanel = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const initialValues = {
    // Identification and Location Features
    image: "",
    name: "",
    brand: "",
    city: "",
    pickup_point: "",
    position: [0, 0],

    // Type Independent Features
    make_year: "",
    top_speed: "",
    kerb_weight: "",
    seats: "",

    // Type Dependent Features
    type: "",
    // Features relevant to Petrol Scooter and Petrol Bike
    mileage: "",
    displacement: "",
    fuel_tank_capacity: "",
    // Features relevant to E-Scooter
    range: "",  
    battery_capacity: "",  
    charging_time: "",  

    // Pricing Details
    late_penalty: "",
    package: {
      daily: {
        price: "",
        deposit: "",
      },
      weekly: {
        price: "",
        deposit: "",
      },
      monthly: {
        price: "",
        deposit: "",
      },
    },
  };

  const handleSubmit = async (values) => {
    try {
      const id = uuidv4();
      if (imageUrl) {
        values.image = imageUrl;
      }
      await setDoc(doc(collection(db, "vehicles"), id), { ...values, id });
      alert("Data successfully written!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };

  const handleImageUpload = (e, setFieldValue) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `images/${file.name}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        setImageUrl(downloadURL);
        setFieldValue("image", downloadURL);
      });
    });
  };

  return (
    <div className="admin-panel-container">
      <h1>Admin Panel</h1>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ setFieldValue, values }) => (
          <Form>
            {/* Identification and Location Features */}
            <div className="identification-location">
              <h2>Identification and Location Features</h2>
              <div className="form-group image-group">
                <label htmlFor="image">Image</label>
                <input
                  name="image"
                  type="file"
                  onChange={(e) => handleImageUpload(e, setFieldValue)}
                />
              </div>

              <div className="form-group name-group">
                <label htmlFor="name">Name</label>
                <Field name="name" type="text" />
              </div>

              <div className="form-group brand-group">
                <label htmlFor="brand">Brand</label>
                <Field as="select" name="brand">
                  <option value="">Select Brand</option>
                  <option value="Vespa">Vespa</option>
                  <option value="Aprilia">Aprilia</option>
                  <option value="Bounce Infinity">Bounce Infinity</option>
                  <option value="Kawasaki">Kawasaki</option>
                </Field>
              </div>

              <div className="form-group city-group">
                <label htmlFor="city">City</label>
                <Field name="city" type="text" />
              </div>

              <div className="form-group pickup-point-group">
                <label htmlFor="pickup_point">Pickup Point</label>
                <Field name="pickup_point" type="text" />
              </div>

              <div className="form-group position-group">
                <label htmlFor="position">Position</label>
                <div className="position-inputs">
                  <Field name="position[0]" type="text" />
                  <Field name="position[1]" type="text" />
                </div>
              </div>
            </div>

            {/* Type Independent Features */}
            <div className="type-independent">
              <h2>Type Independent Features</h2>
              <div className="form-group make-year-group">
                <label htmlFor="make_year">Make Year</label>
                <Field name="make_year" type="text" />
              </div>

              <div className="form-group top-speed-group">
                <label htmlFor="top_speed">Top Speed</label>
                <Field name="top_speed" type="text" />
              </div>

              <div className="form-group kerb-weight-group">
                <label htmlFor="kerb_weight">Kerb Weight</label>
                <Field name="kerb_weight" type="text" />
              </div>

              <div className="form-group seats-group">
                <label htmlFor="seats">Seats</label>
                <Field name="seats" type="text" />
              </div>
            </div>

            {/* Type Dependent Features */}
            <div className="type-dependent">
              <h2>Type Dependent Features</h2>
              <div className="form-group type-group">
                <label htmlFor="type">Type</label>
                <Field
                  as="select"
                  name="type"
                  onChange={(e) => {
                    setFieldValue("type", e.target.value);
                    setVehicleType(e.target.value);
                  }}
                >
                  <option value="">Select Type</option>
                  <option value="Petrol Scooter">Petrol Scooter</option>
                  <option value="E-Scooter">E-Scooter</option>
                  <option value="Petrol Bike">Petrol Bike</option>
                </Field>
              </div>

              {["Petrol Scooter", "Petrol Bike"].includes(vehicleType) && (
                <>
                  <div className="form-group mileage-group">
                    <label htmlFor="mileage">Mileage</label>
                    <Field name="mileage" type="text" />
                  </div>

                  <div className="form-group displacement-group">
                    <label htmlFor="displacement">Displacement</label>
                    <Field name="displacement" type="text" />
                  </div>

                  <div className="form-group fuel-tank-capacity-group">
                    <label htmlFor="fuel_tank_capacity">Fuel Tank Capacity</label>
                    <Field name="fuel_tank_capacity" type="text" />
                  </div>
                </>
              )}

              {vehicleType === "E-Scooter" && (
                <>
                  <div className="form-group range-group">
                    <label htmlFor="range">Range</label>
                    <Field name="range" type="text" />
                  </div>

                  <div className="form-group battery-capacity-group">
                    <label htmlFor="battery_capacity">Battery Capacity</label>
                    <Field name="battery_capacity" type="text" />
                  </div>

                  <div className="form-group charging-time-group">
                    <label htmlFor="charging_time">Charging Time</label>
                    <Field name="charging_time" type="text" />
                  </div>
                </>
              )}
            </div>

            {/* Pricing Details */}
            <div className="pricing-details">
              <h2>Pricing Details</h2>
              <div className="form-group late-penalty-group">
                <label htmlFor="late_penalty">Late Penalty</label>
                <Field name="late_penalty" type="text" />
              </div>

              <div className="form-group daily-price-group">
                <label htmlFor="package.daily.price">Daily Price</label>
                <Field name="package.daily.price" type="text" className="field-array"/>
              </div>

              <div className="form-group daily-deposit-group">
                <label htmlFor="package.daily.deposit">Daily Deposit</label>
                <Field name="package.daily.deposit" type="text" className="field-array"/>
              </div>

              <div className="form-group weekly-price-group">
                <label htmlFor="package.weekly.price">Weekly Price</label>
                <Field name="package.weekly.price" type="text" className="field-array"/>
              </div>

              <div className="form-group weekly-deposit-group">
                <label htmlFor="package.weekly.deposit">Weekly Deposit</label>
                <Field name="package.weekly.deposit" type="text" className="field-array"/>
              </div>

              <div className="form-group monthly-price-group">
                <label htmlFor="package.monthly.price">Monthly Price</label>
                <Field name="package.monthly.price" type="text" className="field-array"/>
              </div>

              <div className="form-group monthly-deposit-group">
                <label htmlFor="package.monthly.deposit">Monthly Deposit</label>
                <Field name="package.monthly.deposit" type="text" className="field-array"/>
              </div>
            </div>

            <button type="submit" className="submit-button">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AdminPanel;

import { useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import { db, storage } from "./firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateVehicle.css";

const UpdateVehicle = () => {
  const { id } = useParams(); // get vehicle id from the route
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchVehicleData = async () => {
      const vehicleRef = doc(db, "vehicles", id);
      const vehicleSnap = await getDoc(vehicleRef);

      if (vehicleSnap.exists()) {
        const vehicleData = vehicleSnap.data();
        setInitialValues(vehicleData);
        setImageUrl(vehicleData.image);
        setVehicleType(vehicleData.type);
      }
    };

    fetchVehicleData();
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      if (imageUrl) {
        values.image = imageUrl;
      }
      await updateDoc(doc(db, "vehicles", id), values);
      alert("Vehicle updated successfully!");
      navigate("/vehicles");
    } catch (error) {
      console.error("Error updating document: ", error);
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

  if (!initialValues) return <div>Loading...</div>;

  return (
    <div className="admin-panel-container">
      <h1>Update Vehicle</h1>
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
                {imageUrl && <img src={imageUrl} alt="Vehicle" />}
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
                  <option value="Triumph">Triumph</option>
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
                  <option value="petrolScooter">Petrol Scooter</option>
                  <option value="eScooter">E-Scooter</option>
                  <option value="petrolBike">Petrol Bike</option>
                  <option value="premiumBike">Premium Bike</option>
                </Field>
              </div>

              {["petrolScooter", "petrolBike", "premiumBike"].includes(
                vehicleType
              ) && (
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
                    <label htmlFor="fuel_tank_capacity">
                      Fuel Tank Capacity
                    </label>
                    <Field name="fuel_tank_capacity" type="text" />
                  </div>
                </>
              )}

              {vehicleType === "eScooter" && (
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

              {vehicleType === "premiumBike" && (
                <>
                  <div className="form-group hourly-price-group">
                    <label htmlFor="package.hourly.price">Hourly Price</label>
                    <Field
                      name="package.hourly.price"
                      type="text"
                      className="field-array"
                    />
                  </div>

                  <div className="form-group hourly-deposit-group">
                    <label htmlFor="package.hourly.deposit">
                      Hourly Deposit
                    </label>
                    <Field
                      name="package.hourly.deposit"
                      type="text"
                      className="field-array"
                    />
                  </div>
                </>
              )}

              <div className="form-group daily-price-group">
                <label htmlFor="package.daily.price">Daily Price</label>
                <Field
                  name="package.daily.price"
                  type="text"
                  className="field-array"
                />
              </div>

              <div className="form-group daily-deposit-group">
                <label htmlFor="package.daily.deposit">Daily Deposit</label>
                <Field
                  name="package.daily.deposit"
                  type="text"
                  className="field-array"
                />
              </div>

              <div className="form-group weekly-price-group">
                <label htmlFor="package.weekly.price">Weekly Price</label>
                <Field
                  name="package.weekly.price"
                  type="text"
                  className="field-array"
                />
              </div>

              <div className="form-group weekly-deposit-group">
                <label htmlFor="package.weekly.deposit">Weekly Deposit</label>
                <Field
                  name="package.weekly.deposit"
                  type="text"
                  className="field-array"
                />
              </div>

              <div className="form-group monthly-price-group">
                <label htmlFor="package.monthly.price">Monthly Price</label>
                <Field
                  name="package.monthly.price"
                  type="text"
                  className="field-array"
                />
              </div>

              <div className="form-group monthly-deposit-group">
                <label htmlFor="package.monthly.deposit">Monthly Deposit</label>
                <Field
                  name="package.monthly.deposit"
                  type="text"
                  className="field-array"
                />
              </div>
            </div>

            <div className="submit-btn-container">
              <button type="submit" className="submit-btn">
                Update Vehicle
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UpdateVehicle;

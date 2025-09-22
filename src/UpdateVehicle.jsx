// src/UpdateVehicle.jsx
import { useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import { db, storage } from "./firebaseConfig";
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateVehicle.css";

const UpdateVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [initialValues, setInitialValues] = useState(null);

  // Custom pricing UI state
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [dateRangeDuration, setDateRangeDuration] = useState(null);
  const [removingCustomPricing, setRemovingCustomPricing] = useState(false);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const vehicleRef = doc(db, "vehicles", id);
        const vehicleSnap = await getDoc(vehicleRef);

        if (vehicleSnap.exists()) {
          const vehicleData = vehicleSnap.data();

          // Ensure customPricing structure exists for the form
          const processedData = {
            ...vehicleData,
            customPricing: vehicleData.customPricing || {
              startDate: "",
              endDate: "",
              dailyPrice: "",
              weeklyPrice: "",
              monthlyPrice: "",
            },
          };

          setInitialValues(processedData);
          setImageUrl(vehicleData.image || "");
          setVehicleType(vehicleData.type || "");

          if (vehicleData.customPricing?.startDate) {
            setCustomStartDate(vehicleData.customPricing.startDate);
          }
          if (vehicleData.customPricing?.endDate) {
            setCustomEndDate(vehicleData.customPricing.endDate);
          }

          if (vehicleData.customPricing?.startDate && vehicleData.customPricing?.endDate) {
            const duration = calculateDateRangeDuration(
              vehicleData.customPricing.startDate,
              vehicleData.customPricing.endDate
            );
            setDateRangeDuration(duration);
          }
        } else {
          alert("Vehicle not found");
          navigate("/vehicles");
        }
      } catch (err) {
        console.error("Error fetching vehicle:", err);
        alert("Failed to load vehicle. See console.");
        navigate("/vehicles");
      }
    };

    fetchVehicleData();
  }, [id, navigate]);

  const handleSubmit = async (values) => {
    try {
      if (imageUrl) {
        values.image = imageUrl;
      }

      // Add/overwrite date range info into customPricing if present
      if (customStartDate && customEndDate) {
        values.customPricing = {
          ...(values.customPricing || {}),
          startDate: customStartDate,
          endDate: customEndDate,
        };
      }

      await updateDoc(doc(db, "vehicles", id), values);
      alert("Vehicle updated successfully!");
      navigate("/vehicles");
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Failed to update vehicle. See console.");
    }
  };

  const handleImageUpload = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;
    const storageReference = ref(storage, `images/${Date.now()}_${file.name}`);
    uploadBytes(storageReference, file)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((downloadURL) => {
        setImageUrl(downloadURL);
        setFieldValue("image", downloadURL);
      })
      .catch((err) => {
        console.error("Image upload failed", err);
        alert("Image upload failed. See console.");
      });
  };

  const calculateDateRangeDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = end - start;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);

    return {
      days: diffInDays,
      weeks: diffInWeeks,
      months: diffInMonths,
      showDaily: true,
      showWeekly: diffInDays >= 7,
      showMonthly: diffInDays >= 30,
    };
  };

  const handleStartDateChange = (e) => {
    const newDate = e.target.value;
    setCustomStartDate(newDate);
    if (newDate && customEndDate) {
      const duration = calculateDateRangeDuration(newDate, customEndDate);
      setDateRangeDuration(duration);
    }
  };

  const handleEndDateChange = (e) => {
    const newDate = e.target.value;
    setCustomEndDate(newDate);
    if (customStartDate && newDate) {
      const duration = calculateDateRangeDuration(customStartDate, newDate);
      setDateRangeDuration(duration);
    }
  };

  const renderCustomPricingFields = () => {
    if (!dateRangeDuration) return null;

    const { days, weeks, months, showDaily, showWeekly, showMonthly } = dateRangeDuration;

    return (
      <div className="dynamic-pricing-fields">
        <div className="duration-info">
          <p className="duration-text">
            Duration: {days} day{days !== 1 ? "s" : ""}
            {weeks > 0 && ` (${weeks} week${weeks !== 1 ? "s" : ""})`}
            {months > 0 && ` (${months} month${months !== 1 ? "s" : ""})`}
          </p>
        </div>

        {showDaily && (
          <div className="form-group custom-daily-price-group">
            <label htmlFor="customPricing.dailyPrice">Custom Daily Price</label>
            <Field
              name="customPricing.dailyPrice"
              type="text"
              placeholder="Enter daily price for this period"
              className="field-array"
            />
          </div>
        )}

        {showWeekly && (
          <div className="form-group custom-weekly-price-group">
            <label htmlFor="customPricing.weeklyPrice">Custom Weekly Price</label>
            <Field
              name="customPricing.weeklyPrice"
              type="text"
              placeholder="Enter weekly price for this period"
              className="field-array"
            />
          </div>
        )}

        {showMonthly && (
          <div className="form-group custom-monthly-price-group">
            <label htmlFor="customPricing.monthlyPrice">Custom Monthly Price</label>
            <Field
              name="customPricing.monthlyPrice"
              type="text"
              placeholder="Enter monthly price for this period"
              className="field-array"
            />
          </div>
        )}
      </div>
    );
  };

  // Remove custom pricing handler (minimal change)
  const handleRemoveCustomPricing = async (formikSetFieldValue) => {
    const ok = window.confirm(
      "Are you sure you want to remove custom pricing for this vehicle? This action cannot be undone."
    );
    if (!ok) return;

    setRemovingCustomPricing(true);
    try {
      await updateDoc(doc(db, "vehicles", id), {
        customPricing: deleteField(),
      });

      // update local UI & formik fields
      setCustomStartDate("");
      setCustomEndDate("");
      setDateRangeDuration(null);

      if (formikSetFieldValue) {
        formikSetFieldValue("customPricing", {
          startDate: "",
          endDate: "",
          dailyPrice: "",
          weeklyPrice: "",
          monthlyPrice: "",
        });
      }

      // Also update initialValues so the remove button hides if component doesn't reload
      setInitialValues((prev) => ({
        ...prev,
        customPricing: {
          startDate: "",
          endDate: "",
          dailyPrice: "",
          weeklyPrice: "",
          monthlyPrice: "",
        },
      }));

      alert("Custom pricing removed successfully.");
    } catch (err) {
      console.error("Failed to remove custom pricing:", err);
      alert("Failed to remove custom pricing. See console.");
    } finally {
      setRemovingCustomPricing(false);
    }
  };

  if (!initialValues) return <div>Loading...</div>;

  return (
    <div className="admin-panel-container">
      <h1>Update Vehicle</h1>
      <Formik initialValues={initialValues} enableReinitialize={true} onSubmit={handleSubmit}>
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
                {imageUrl && <img src={imageUrl} alt="Vehicle" style={{ maxWidth: 240, marginTop: 8 }} />}
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

              {["petrolScooter", "petrolBike", "premiumBike"].includes(vehicleType) && (
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

            {/* Standard Pricing Details */}
            <div className="pricing-details">
              <h2>Standard Pricing Details</h2>
              <div className="form-group late-penalty-group">
                <label htmlFor="late_penalty">Late Penalty</label>
                <Field name="late_penalty" type="text" />
              </div>

              {vehicleType === "premiumBike" && (
                <>
                  <div className="form-group hourly-price-group">
                    <label htmlFor="package.hourly.price">Hourly Price</label>
                    <Field name="package.hourly.price" type="text" className="field-array" />
                  </div>

                  <div className="form-group hourly-deposit-group">
                    <label htmlFor="package.hourly.deposit">Hourly Deposit</label>
                    <Field name="package.hourly.deposit" type="text" className="field-array" />
                  </div>
                </>
              )}

              <div className="form-group daily-price-group">
                <label htmlFor="package.daily.price">Daily Price</label>
                <Field name="package.daily.price" type="text" className="field-array" />
              </div>

              <div className="form-group daily-deposit-group">
                <label htmlFor="package.daily.deposit">Daily Deposit</label>
                <Field name="package.daily.deposit" type="text" className="field-array" />
              </div>

              <div className="form-group weekly-price-group">
                <label htmlFor="package.weekly.price">Weekly Price</label>
                <Field name="package.weekly.price" type="text" className="field-array" />
              </div>

              <div className="form-group weekly-deposit-group">
                <label htmlFor="package.weekly.deposit">Weekly Deposit</label>
                <Field name="package.weekly.deposit" type="text" className="field-array" />
              </div>

              <div className="form-group monthly-price-group">
                <label htmlFor="package.monthly.price">Monthly Price</label>
                <Field name="package.monthly.price" type="text" className="field-array" />
              </div>

              <div className="form-group monthly-deposit-group">
                <label htmlFor="package.monthly.deposit">Monthly Deposit</label>
                <Field name="package.monthly.deposit" type="text" className="field-array" />
              </div>
            </div>

            {/* Custom Pricing */}
            <div className="pricing-details">
              <h2>Custom Pricing Details (Optional)</h2>
              <p className="section-description">
                Select date range for custom pricing. Pricing options will appear based on the duration selected.
              </p>

              <div className="custom-date-inputs">
                <div className="form-group custom-start-date-group">
                  <label htmlFor="customStartDate">Custom Pricing Start Date & Time</label>
                  <input
                    id="customStartDate"
                    type="datetime-local"
                    value={customStartDate}
                    onChange={handleStartDateChange}
                    className="field-array"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div className="form-group custom-end-date-group">
                  <label htmlFor="customEndDate">Custom Pricing End Date & Time</label>
                  <input
                    id="customEndDate"
                    type="datetime-local"
                    value={customEndDate}
                    onChange={handleEndDateChange}
                    className="field-array"
                    min={customStartDate || new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>

              {renderCustomPricingFields()}

              {/* Remove custom pricing button: show only if there is existing custom pricing */}
              {initialValues?.customPricing && (initialValues.customPricing.startDate || initialValues.customPricing.dailyPrice || initialValues.customPricing.weeklyPrice || initialValues.customPricing.monthlyPrice) && (
                <div style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    className="submit-btn"
                    onClick={() => handleRemoveCustomPricing(setFieldValue)}
                    disabled={removingCustomPricing}
                    style={{ background: "#d9534f", borderColor: "#d43f3a" }}
                  >
                    {removingCustomPricing ? "Removing..." : "Remove Custom Pricing"}
                  </button>
                </div>
              )}
            </div>

            <div className="submit-btn-container" style={{ marginTop: 18 }}>
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
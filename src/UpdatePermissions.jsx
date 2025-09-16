import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from './firebaseConfig'; // Your firebase config
import { doc, getDoc, updateDoc } from "firebase/firestore";
import './UpdatePermissions.css'; // CSS for the page

const UpdatePermissions = () => {
  const { id } = useParams(); // Get the email of the admin from the route
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      const adminRef = doc(db, "admins", id);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        const adminData = adminSnap.data();
        setAdminEmail(adminData.email);
        setSelectedPermissions(adminData.permissions);
      }
    };
    fetchAdminData();
  }, [id]);

  const availablePermissions = ['add_vehicle', 'view_vehicle', 'update_vehicle', 'delete_vehicle', 'view_users', 'view_admins', 'update_permissions', 'view_bookings', 'delete_admin', 'update_banners', 'add_banners', 'delete_banner' ]; // You can add more permissions

  const handleCheckboxChange = (permission) => {
    // console.log(selectedPermissions);
    setSelectedPermissions(prevState =>
      prevState.includes(permission)
        ? prevState.filter(perm => perm !== permission)
        : [...prevState, permission]
    );
  };

//   useEffect(() => {
//     console.log("After update:", selectedPermissions);
//   }, [selectedPermissions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        var values = {
            email: adminEmail,
            permissions: selectedPermissions
        };
        await updateDoc(doc(db, "admins", id), values);
        alert("Permissions updated successfully!");
        navigate("/admins");
      } catch (error) {
        alert("Error Updating Permission. Please contact the developer.");
        console.error("Error updating permissions document: ", error);
      }
  };

  return (
    <>
    <h2>Update Permissions for {adminEmail}</h2>
    <div className="permissions-container">
      <form className='update-permissions-form' onSubmit={handleSubmit}>
        <div className="checkbox-list">
          {availablePermissions.map((permission) => (
            <label key={permission} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedPermissions.includes(permission)}
                onChange={() => handleCheckboxChange(permission)}
              />
              <p>{permission}</p>
            </label>
          ))}
        </div>
        <button type="submit" className="submit-btn">Update Permissions</button>
      </form>
    </div>
    </>
  );
};

export default UpdatePermissions;

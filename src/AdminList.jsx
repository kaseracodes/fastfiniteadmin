import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from "./firebaseConfig"; // Adjust path for Firebase config
import './AdminList.css';
import { useAuth } from "./AuthContext";


const AdminsTable = ({ admins }) => {

  const { user, permissions } = useAuth();
  const navigate = useNavigate();

  const handleUpdatePermissions = async (id) => {
    navigate(`/updatepermissions/${id}`);
  };

  const handleDeleteAdmin = async (id, email) => {
    // console.log(permissions);
    if ( !permissions.includes('delete_admin')){
      alert("You dont have the necessary permission to delete an admin")
      return;
    }
    if ( user.email === email ){
      alert("You cannot delete yourself");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this admin?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "admins", id)); // Deleting the admin document from Firestore
        // await auth.deleteUser(id); // auth.deleteUser() is not a available in Firebase client side SDK but in Firebase Admin SDK
        alert("Admin deleted successfully");
        window.location.reload(); // Reload the data after deletion
      } catch (error) {
        console.error("Error deleting admin: ", error);
        alert("Failed to delete the admin. Please try again.");
      }
    }
  };

  return (
    <table className="admins-table">
      <thead>
        <tr>
          <th className="actions-header">Actions</th>
          <th>Email</th>
          <th>Permissions</th>
        </tr>
      </thead>
      <tbody>
        {admins.map((admin) => (
          <tr key={admin.id}>
            <td className="actions-header">
              <button onClick={() => handleUpdatePermissions(admin.id)} className="update-button">
                Update Permissions
              </button>
              <button onClick={() => handleDeleteAdmin(admin.id, admin.email)} className="delete-btn">
                Delete Admin
              </button>
            </td>
            <td>{admin.email}</td>
            <td>{admin.permissions ? admin.permissions.join(", ") : "None"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const AdminList = () => {
  const [admins, setAdmins] = useState([]);

  const fetchAdmins = async () => {
    try {
      const adminsSnapshot = await getDocs(collection(db, "admins"));
      const adminsData = adminsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAdmins(adminsData);
    } catch (error) {
      console.error("Error fetching admins: ", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="admin-list">
      <h2>Admin Management</h2>
      <AdminsTable admins={admins} />
    </div>
  );
};

export default AdminList;

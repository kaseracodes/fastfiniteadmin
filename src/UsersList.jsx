import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions
import { db } from './firebaseConfig'; // Adjust the path to your Firebase configuration
import './UsersList.css'; // Import the CSS file

const UsersList = () => {
  const [users, setUsers] = useState([]);

  // Fetch all users from the 'users' collection
  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
      // alert('Users successfully fetched!');
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts
  }, []);

  return (
    <div className="users-list-container">
      <h2 className="users-heading">Users List</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>UID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Profile Picture</th>
            {/* <th>Bookings</th> */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="user-row">
              <td>{user.uid}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phoneNo}</td>
              <td>{user.address || 'N/A'}</td>
              <td>{user.profilePic ? <img src={user.profilePic} alt="Profile" className="profile-pic" /> : 'No Image'}</td>
              {/* <td>{user.bookings?.join(', ') || 'No Bookings'}</td> Display bookings as comma-separated IDs */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;

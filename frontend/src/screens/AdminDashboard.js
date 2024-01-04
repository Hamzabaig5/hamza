// AdminDashboard.js
import React from 'react';
import AddRoomForm from '../components/AddRoomForm'; // Import the AddRoomForm component

function AdminDashboard() {
  // Add your admin-specific UI and functionality here

  return (
    <div>
      <h1>Welcome to the Admin Dashboard</h1>
      {/* Add admin-specific content here */}
      <AddRoomForm /> {/* Include the AddRoomForm component */}
    </div>
  );
}

export default AdminDashboard;
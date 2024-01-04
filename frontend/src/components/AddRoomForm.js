import React, { useState } from 'react';
import axios from 'axios';

function AddRoomForm() {
  const [roomData, setRoomData] = useState({
    name: '',
    maxcount: 0,
    phonenumber: 0,
    rentperday: 0,
    type: '',
    description: '',
    images: [], // For storing the selected images
  });

  const handleInputChange = (e) => {
    setRoomData({
      ...roomData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setRoomData({
      ...roomData,
      images: e.target.files,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', roomData.name);
    formData.append('maxcount', roomData.maxcount);
    formData.append('phonenumber', roomData.phonenumber);
    formData.append('rentperday', roomData.rentperday);
    formData.append('type', roomData.type);
    formData.append('description', roomData.description);

    // Append each selected image to the FormData
    for (let i = 0; i < roomData.images.length; i++) {
      formData.append('images', roomData.images[i]);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/rooms/addroom', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      // Handle success or redirect as needed
    } catch (error) {
      console.error('Error adding room:', error);
      // Handle error
    }
  };

  return (
    <div>
      <h2>Add New Room</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={roomData.name} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Max Count:</label>
          <input type="number" name="maxcount" value={roomData.maxcount} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Phone Number:</label>
          <input type="number" name="phonenumber" value={roomData.phonenumber} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Rent per Day:</label>
          <input type="number" name="rentperday" value={roomData.rentperday} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Type:</label>
          <input type="text" name="type" value={roomData.type} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Description:</label>
          <textarea name="description" value={roomData.description} onChange={handleInputChange} required />
        </div>

        <div>
          <label>Images:</label>
          <input type="file" name="images" multiple onChange={handleImageChange} accept="image/*" required />
        </div>

        <button type="submit">Add Room</button>
      </form>
    </div>
  );
}

export default AddRoomForm;

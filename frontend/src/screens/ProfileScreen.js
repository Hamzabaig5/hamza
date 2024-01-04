import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { Tag } from 'antd';
import axios from 'axios';

import MyBookingScreen from './MyBookingScreen';
const { TabPane } = Tabs;

function ProfileScreen() {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    } else {
      setName(user.name);
      setEmail(user.email);
    }
  }, []);

  const updateProfileHandler = async (e) => {
    e.preventDefault();

    try {
      const updatedUser = await axios.post(
        'http://localhost:5000/api/users/updateprofile',
        {
          name,
          email,
          userId: user._id,
        }
      );

      localStorage.setItem('currentUser', JSON.stringify(updatedUser.data));
      window.location.href = '/profile';
    } catch (error) {
      console.log(error);
      alert('Error updating profile');
    }
  };

  function callback(key) {
    console.log(key);
  }

  return (
    <div className="ml-3 mt-3">
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Profile" key="1">
          <div className="row">
            <div className="col-xs-12 ml-5 mb-5">
              <div className="ml-3 mt-3">
                <h1>Update Profile</h1>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
                <button
                  onClick={(e) => {
                    updateProfileHandler(e);
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane tab="Booking" key="2">
          <MyBookingScreen></MyBookingScreen>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default ProfileScreen;

import React, { useState } from 'react';
import axios from 'axios';

import Loader from '../components/Loader';
import Error from '../components/Error';
import Success from '../components/Success';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = () => {
    // Simple email format check
    const emailPattern = /^\S+@\S+\.\S+$/;
    return emailPattern.test(email);
  };

  const validatePassword = () => {
    // Simple password length check
    return password.length >= 6;
  };

  const handleLogin = async () => {
    setLoading(true);

    // Perform validation checks
    if (!validateEmail()) {
      setError('Invalid email format');
      setLoading(false);
      return;
    }

    if (!validatePassword()) {
      setError('Password should be at least 6 characters long');
      setLoading(false);
      return;
    }

    const user = {
      email,
      password,
    };

    try {
      const result = (await axios.post('/api/users/login', user)).data;
      console.log(result);
  
      // Store user data in local storage
      localStorage.setItem('currentUser', JSON.stringify(result));
  
      // Check if the user is an admin
      if (result.isAdmin) {
        // Redirect to the admin page (replace '/admin' with your admin route)
        window.location.href = '/admin';
      } else {
        // Redirect to the home page (replace '/home' with your home route)
        window.location.href = '/home';
      }
    } catch (error) {
      console.log(error);
      setError('Invalid Credentials');
    }
  
    setLoading(false);
  };

  return (
    <div>
      {loading && <Loader />}

      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          {error.length > 0 && <Error msg={error} />}
          <div className="bs">
            <h2>Login</h2>

            <input
              type="text"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {loading ? (
              <div>Login...Please Wait...</div>
            ) : (
              <button
                className="btn btn-primary mt-3"
                onClick={handleLogin}
                disabled={!validateEmail() || !validatePassword() || loading}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;

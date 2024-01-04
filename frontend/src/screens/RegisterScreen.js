import React, { useState } from 'react';
import axios from 'axios';

import Loader from '../components/Loader';
import Error from '../components/Error';
import Success from '../components/Success';

function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');

  const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = () => {
    return password.length >= 6;
  };

  const validateConfirmPassword = () => {
    return password === cpassword;
  };

  const validateName = () => {
    const namePattern = /^[A-Za-z]+$/;
    return namePattern.test(name);
  };

  const handleRegister = async () => {
    setLoading(true);
    setErrors([]);

    const inputErrors = [];

    if (!validateEmail()) {
      inputErrors.push('Invalid email format');
    }

    if (!validatePassword()) {
      inputErrors.push('Password should be at least 6 characters long');
    }

    if (!validateConfirmPassword()) {
      inputErrors.push('Password and confirm password do not match');
    }

    if (!validateName()) {
      inputErrors.push('Name should contain only alphabetic characters');
    }

    if (inputErrors.length > 0) {
      setErrors(inputErrors);
      setLoading(false);
      return;
    }

    const user = {
      name,
      email,
      password,
      cpassword,
    };

    try {
      const result = (await axios.post('/api/users/register', user)).data;
      console.log(result);

      setName('');
      setEmail('');
      setPassword('');
      setCpassword('');
      setSuccess(result);
    } catch (error) {
      console.log(error);
      setErrors([error.message]);
    }

    setLoading(false);
  };

  return (
    <div>
      {loading && <Loader />}
      {errors.length > 0 && (
        <Error>
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Error>
      )}

      <div className="row justify-content-center mt-5">
        <div className="col-md-5 mt-5">
          {success.length > 0 && <Success msg={success} />}
          <div className="bs">
            <h2>Register</h2>
            <input
              type="text"
              className={`form-control ${
                name && !validateName() ? 'is-invalid' : ''
              }`}
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {!validateName() && (
              <div className="invalid-feedback">
                Name should contain only alphabetic characters
              </div>
            )}
            <input
              type="text"
              className={`form-control ${
                email && !validateEmail() ? 'is-invalid' : ''
              }`}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!validateEmail() && (
              <div className="invalid-feedback">Invalid email format</div>
            )}
            <input
              type="password"
              className={`form-control ${
                password && !validatePassword() ? 'is-invalid' : ''
              }`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {!validatePassword() && (
              <div className="invalid-feedback">
                Password should be at least 6 characters long
              </div>
            )}
            <input
              type="password"
              className={`form-control ${
                cpassword && !validateConfirmPassword() ? 'is-invalid' : ''
              }`}
              placeholder="Confirm Password"
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
            />
            {!validateConfirmPassword() && (
              <div className="invalid-feedback">
                Password and confirm password do not match
              </div>
            )}
            {loading ? (
              <div>Registering... Please Wait...</div>
            ) : (
              <button
                className="btn btn-primary mt-3"
                onClick={handleRegister}
                disabled={loading}
              >
                Register
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen;

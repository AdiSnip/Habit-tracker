import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';

let usernameTimeout;

const Signup = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [unauthmessage, setUnauthmessage] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'username') {
      clearTimeout(usernameTimeout);
      if (value.length < 3) {
        setUsernameAvailable(false);
        setUnauthmessage('Username must be at least 3 characters.');
        return;
      }
      usernameTimeout = setTimeout(() => {
        axios
          .post('/api/usernameauth', { username: value })
          .then((res) => {
            setUsernameAvailable(true);
            setUnauthmessage(res.data.message);
          })
          .catch((err) => {
            setUsernameAvailable(false);
            setUnauthmessage(err.response?.data?.message || 'Username check failed.');
          });
      }, 500);
    }

    if (name === 'password' || name === 'confirmPassword') {
      const pass = name === 'password' ? value : formData.password;
      const confirm = name === 'confirmPassword' ? value : formData.confirmPassword;
      setPasswordMismatch(pass !== confirm);
    }
  };

  const isFormValid =
    Object.values(formData).every((val) => val.trim()) &&
    usernameAvailable &&
    !passwordMismatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { firstname, lastname, username, email, password } = formData;

      const res = await axios.post('/api/register', {
        firstname,
        lastname,
        username,
        email,
        password
      });

      if (res.status === 201) {
        setSuccessMessage('Registration successful. Redirecting...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen w-full absolute top-0 left-0 flex items-center justify-center z-999 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

        {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}
        {successMessage && <div className="text-green-500 text-center mb-4">{successMessage}</div>}
        {unauthmessage && (
          <div
            className={`text-center mb-4 ${
              usernameAvailable ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {unauthmessage}
          </div>
        )}
        {passwordMismatch && (
          <div className="text-red-500 text-center mb-4">Passwords do not match.</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="w-1/2 px-3 py-2 border rounded-md"
            />
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="w-1/2 px-3 py-2 border rounded-md"
            />
          </div>

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="w-full mb-4 px-3 py-2 border rounded-md"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full mb-4 px-3 py-2 border rounded-md"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password (min 6 chars)"
            required
            className="w-full mb-4 px-3 py-2 border rounded-md"
          />

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            className="w-full mb-6 px-3 py-2 border rounded-md"
          />

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-2 px-4 rounded-md transition duration-200 ${
              isFormValid
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

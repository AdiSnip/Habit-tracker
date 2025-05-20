import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, UserPlus2 } from 'lucide-react';

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
        setSuccessMessage('Account created! Summoning portal to login...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-950 text-white font-sans relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      {/* Signup Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-xl border border-white/20">
        <div className="flex items-center justify-center gap-2 mb-6">
          <UserPlus2 className="text-yellow-300 w-6 h-6" />
          <h2 className="text-3xl font-bold text-yellow-300 tracking-wider">Create Your Hero Profile</h2>
        </div>

        {errorMessage && <div className="text-red-400 text-center mb-3">{errorMessage}</div>}
        {successMessage && <div className="text-green-400 text-center mb-3">{successMessage}</div>}
        {unauthmessage && (
          <div className={`text-center mb-3 ${usernameAvailable ? 'text-green-400' : 'text-red-400'}`}>
            {unauthmessage}
          </div>
        )}
        {passwordMismatch && (
          <div className="text-red-400 text-center mb-3">Passwords do not match.</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="w-1/2 px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="w-1/2 px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a Hero Name"
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Guild Email"
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Secret Code (min 6 chars)"
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Secret Code"
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 font-bold rounded-full shadow-lg transition duration-300 ${
              isFormValid
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:scale-105'
                : 'bg-gray-500 text-white cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Begin Your Quest
          </button>
        </form>

        <p className="text-center text-sm text-white mt-6">
          Already on a journey?{' '}
          <Link to="/login" className="text-yellow-300 hover:underline">
            Return to the Gate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Swords } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-indigo-800 to-blue-900 text-white font-sans relative overflow-hidden">

      {/* Background Glow Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

      {/* Login Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-md border border-white/20">
        <div className="flex items-center justify-center gap-2 mb-6">
          <ShieldCheck className="text-yellow-300 w-6 h-6" />
          <h2 className="text-3xl font-bold text-yellow-300 tracking-wider">Hero's Login</h2>
        </div>

        <form method="post" action="/api/login" className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-white mb-1">Guild Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-white mb-1">Secret Code</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold rounded-full hover:scale-105 transform transition duration-300 shadow-lg"
          >
            <Swords className="w-5 h-5" />
            Enter the Realm
          </button>
        </form>

        <p className="text-center text-sm text-white mt-6">
          Not a hero yet?{' '}
          <Link to="/signup" className="text-yellow-300 hover:underline">
            Enlist Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

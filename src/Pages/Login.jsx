import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Swords } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen w-full z-99 flex items-center justify-center bg-black text-white font-sans absolute left-0 top-0 overflow-hidden">

      {/* Background Glow Orbs */}
      <div className="absolute top-10 left-0 w-72 h-72 bg-[#51FA15] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#51FA15] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      {/* Login Card */}
      <div className="relative z-10 bg-black/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-md border border-[#51FA15]/40">
        <div className="flex items-center justify-center gap-2 mb-6">
          <ShieldCheck className="text-[#51FA15] w-6 h-6" />
          <h2 className="text-3xl font-bold text-[#51FA15] tracking-wider">Hero's Login</h2>
        </div>

        <form method="post" action="/api/login" className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-white mb-1">Guild Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 rounded-lg bg-black border border-[#51FA15]/50 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#51FA15]"
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
              className="w-full px-4 py-2 rounded-lg bg-black border border-[#51FA15]/50 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#51FA15]"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-black border border-[#51FA15] text-[#51FA15] font-bold rounded-full hover:bg-[#51FA15] hover:text-black hover:scale-105 transform transition duration-300 shadow-lg"
          >
            <Swords className="w-5 h-5" />
            Enter the Realm
          </button>
        </form>

        <p className="text-center text-sm text-white mt-6">
          Not a hero yet?{' '}
          <Link to="/signup" className="text-[#51FA15] hover:underline">
            Enlist Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import React from 'react'
import { Link } from 'react-router-dom'

const Accnav = () => {
  return (
    <div className='w-[100%] h-[8vh] bg-white relative z-90 top-0 flex items-center justify-end pr-4 gap-4'>
      <Link 
        to="/login" 
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
      >
        Login
      </Link>
      <Link 
        to="/signup" 
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
      >
        Sign Up
      </Link>
    </div>
  )
}

export default Accnav
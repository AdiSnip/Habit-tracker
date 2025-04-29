import React from 'react'
import { useContext } from 'react'
import UserContext from '../Contexts/Context'
import { Link } from 'react-router-dom'

const Accnav = () => {
  const data = useContext(UserContext);
  return (
    <div className='w-[100%] h-[8vh] bg-white relative z-90 top-0 flex items-center justify-end pr-4 gap-4'>
      {
        data.userdata ? (
          <div className='flex items-center gap-4'>
            <span className='text-black'>{data.userdata.name}</span>
            <div className='h-6 w-6 bg-blue-300 rounded-full text-white grid place-items-center'>{data.userdata.name[0]}</div>
          </div>
        ) : (
          <div className='flex items-center gap-4'>
            <Link to="/login" className='text-black'>Login</Link>
            <Link to="/signup" className='text-black'>Signup</Link>
          </div>
        )
      }
    </div>
  )
}

export default Accnav
import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Container from './Pages/Container';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import TaskManager from './Pages/TaskManager';
import Analytics from './Pages/Analytics';
import axios from 'axios';
import UserContext from './Contexts/Context';
import Settings from './Pages/Settings';

const App = () => {
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [userdata, setUserdata] = useState() // prevent double fetch in dev
  
//get data from backend
function getData(){
  if (!hasFetched.current) {
    axios.get('/api/user')
      .then((response) => {
        if (!response.data || Object.keys(response.data).length === 0) {
          navigate('/login'); // Navigate if no user data
        } else {
          setUserdata(response.data); // Only set user if data exists
          hasFetched.current = true;
          console.log('User data fetched:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        navigate('/login'); // Navigate on error (like 401 unauthorized)
      });
  }
}

  useEffect(() => {
    getData();
    // Cleanup function to reset the ref when the component unmounts
  }, []);
  
  

  return (
    <div>
      <UserContext.Provider value={{userdata}}>
      <Navbar />
      <div className="flex flex-col md:pl-[6%] bg-black">
        <Routes>
          <Route path="/" element={<Container data={userdata}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/task" element={<TaskManager getData={userdata} refetch={getData}/>} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings data={userdata}/>} />
        </Routes>
      </div>
      </UserContext.Provider>
    </div>
  );
};

export default App;

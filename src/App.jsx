import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Accnav from './Components/Accnav';
import Container from './Pages/Container';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import TaskManager from './Pages/TaskManager';
import Analytics from './Pages/Analytics';
import axios from 'axios';
import { useContext } from 'react';
import UserContext from './Contexts/Context';

const App = () => {
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [userdata, setUserdata] = useState() // prevent double fetch in dev
  

  

  return (
    <div>
      <UserContext.Provider value={{userdata}}>
      <Navbar />
      <div className="flex flex-col pl-[5%]">
        <Accnav />
        <Routes>
          <Route path="/" element={<Container />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/task" element={<TaskManager />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
      </UserContext.Provider>
    </div>
  );
};

export default App;

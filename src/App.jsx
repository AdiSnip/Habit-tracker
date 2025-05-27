import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Container from "./Pages/Container";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import TaskManager from "./Pages/TaskManager";
import Analytics from "./Pages/Analytics";
import Settings from "./Pages/Settings";
import axios from "axios";
import UserContext from "./Contexts/Context";
import AnimatedLoadingBar from "./Components/AnimatedLoadingBar";

const App = () => {
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true); // track loading state

  //get data from backend with min 2s loading delay
  function getData() {
    if (!hasFetched.current) {
      hasFetched.current = true;
      
      const fetchPromise = axios.get("/api/user");
      const delayPromise = new Promise((res) => setTimeout(res, 2000)); // 2 seconds delay

      Promise.all([fetchPromise, delayPromise])
        .then(([response]) => {
          if (!response.data || Object.keys(response.data).length === 0) {
            navigate("/login");
          } else {
            setUserdata(response.data);
            console.log("User data fetched:", response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          navigate("/login");
        })
        .finally(() => {
          setLoading(false); // hide loading screen after both fetch and delay finish
        });
    }
  }

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <>
        <AnimatedLoadingBar />
        <div className="flex justify-center items-center h-screen bg-black text-green-400 font-semibold">
          Loading your data...
        </div>
      </>
    );
  }

  return (
    <div>
      <UserContext.Provider value={{ userdata }}>
        <Navbar />
        <div className="flex flex-col md:pl-[6%] bg-black">
          <Routes>
            <Route path="/" element={<Container data={userdata} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/task"
              element={<TaskManager getData={userdata} refetch={getData} />}
            />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings data={userdata} />} />
          </Routes>
        </div>
      </UserContext.Provider>
    </div>
  );
};

export default App;

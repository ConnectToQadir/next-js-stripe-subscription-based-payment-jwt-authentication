"use client"
import { createContext, useEffect, useState, } from "react";
import axios from "axios";



export const AuthContext = createContext();

const Context = ({ children }) => {

  var [user,setUser] = useState(null)


  const fetchUser = async () => {
    try {
      var res = await axios.get("/api/auth/profile");
      setUser(res.data.message)
    } catch (error) {
      setUser(null)
    }
  };

  const refetchUser = () =>{
    fetchUser()
  }


  const handleLogout = async () => {
    try {
      const confirmLogout = window.confirm("Are you sure you want to logout?");
      if (!confirmLogout) return;
      const res = await axios.post("/api/auth/logout");
      if (res.data.success) {
        window.location.replace("/");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(()=>{
    fetchUser()
  },[])

  return (
    <AuthContext.Provider value={{ user,setUser,refetchUser,handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default Context;

import React from "react";
import SignUp from "./mainComponents/SignUp.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserName from "./mainComponents/UserName.jsx";
import SignIn from "./mainComponents/SignIn.jsx";
import SettingsPage from "./chatComponents/Settings.jsx";
import Chat from "./mainComponents/chat.jsx";

import socket from "./socket/socket.js";
import { useEffect } from "react";
 const App = () => {
  useEffect(() => {
    socket.connect();          
    console.log("Socket connected");

    return () => {
      socket.disconnect();     
      console.log("Socket disconnected");
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/UserName" element={<UserName />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/Settings" element={<SettingsPage />} />
        <Route path="/chat" element={<Chat />} />
       
      </Routes>
    </BrowserRouter>
  );
};
export default App;
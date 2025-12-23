import React from "react";
import SignUp from "./mainComponents/signUp.jsx";
import {BrowserRouter,Routes,Route} from "react-router-dom"
import UserName from "./mainComponents/UserName.jsx";
import SignIn from "./mainComponents/SignIn.jsx";
import SettingsPage from "./chatComponets/Settings.jsx";
import socket from "./socket/socket.js";
import Chat from "./mainComponents/Chat.jsx";
import { useEffect } from "react";
const App=()=>{
  /*useEffect(() => {
    socket.connect();          
    console.log("Socket connected");

    return () => {
      socket.disconnect();     
      console.log("Socket disconnected");
    };
  }, []);8*/

  return (
    <BrowserRouter>
    <Routes>    
    <Route path="/" element={<SignUp />}/>
    <Route path="/UserName" element={<UserName/>}/> 
    <Route path="/SignIn" element={<SignIn/>}/>
    <Route path="/UserName" element={<UserName/>}/>
    <Route path="/Settings" element={<SettingsPage/>}/>
<<<<<<< HEAD
    <Route path="/Chat" element={<Chat/>}/>
=======
    <Route path="/chat" element={<Chat/>}/>
>>>>>>> c64afec90fe8b76d0712bcc6cc8b46f7f48fada5
    </Routes>
    </BrowserRouter>
  );
};
export default App;

import React from "react";
import SignUp from "./mainComponents/signUp.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserName from "./mainComponents/UserName.jsx";
import SignIn from "./mainComponents/SignIn.jsx";
import SettingsPage from "./chatComponents/Settings.jsx";
import Chat from "./mainComponents/Chat.jsx";
import ChatAiPage from "./mainComponents/ChatAiPage.jsx";
import SearchFriendPage from "./mainComponents/SearchFriendPage.jsx";
import VideoCall from "./mainComponents/VideoCall.jsx";

import socket from "./socket/socket.js";
import { useEffect } from "react";
const App = () => {
  // useEffect(() => {
  //   socket.connect();
  //   console.log("Socket connected");

  //   return () => {
  //     socket.disconnect();
  //     console.log("Socket disconnected");
  //   };
  // }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/UserName" element={<UserName />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Settings" element={<SettingsPage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/SearchFriend" element={<SearchFriendPage />} />
        <Route path="/ai-chat" element={<ChatAiPage />} />
        <Route path="/video-call/:id"element={<VideoCall />}/>

      </Routes>
    </BrowserRouter>
  );
};
export default App;
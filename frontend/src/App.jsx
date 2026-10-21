import React from "react";
import SignUp from "./pages/auth/SignUp.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserName from "./pages/auth/UserName.jsx";
import SignIn from "./pages/auth/SignIn.jsx";
import SettingsPage from "./pages/chat/Settings.jsx";
import Chat from "./pages/chat/Chat.jsx";
import ChatAiPage from "./pages/chat/ChatAiPage.jsx";
import SearchFriendPage from "./pages/chat/SearchFriendPage.jsx";
import VideoCall from "./pages/chat/VideoCall.jsx";

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

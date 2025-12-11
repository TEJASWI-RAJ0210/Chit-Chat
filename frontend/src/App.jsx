import React from "react";
import SignUp from "./mainComponents/signUp.jsx";
import {BrowserRouter,Routes,Route} from "react-router-dom"
import UserName from "./mainComponents/UserName.jsx";
import SignIn from "./mainComponents/SignIn.jsx";
import SettingsPage from "./chatComponets/Settings.jsx";
const App=()=>{
  return (
    <BrowserRouter>
    <Routes>    
    <Route path="/" element={<SignUp />}/>
    <Route path="/UserName" element={<UserName/>}/> 
    <Route path="/SignIn" element={<SignIn/>}/>
    <Route path="/UserName" element={<UserName/>}/>
    <Route path="/Settings" element={<SettingsPage/>}/>
    </Routes>
    </BrowserRouter>
  );
};
export default App;

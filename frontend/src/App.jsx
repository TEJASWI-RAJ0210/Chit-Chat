import React from "react";
import SignUp from "./mainComponents/SignUp.jsx";
import {BrowserRouter,Routes,Route} from "react-router-dom"
import UserName from "./mainComponents/UserName.jsx";
import Login from "./mainComponents/Login.jsx";

const App=()=>{
  return (
    <BrowserRouter>
    <Routes>    
    <Route path="/" element={<SignUp />}/>
    <Route path="/UserName" element={<UserName/>}/> 
    <Route path="/Login" element={<Login/>}/>
    </Routes>
    </BrowserRouter>
  );
};
export default App;

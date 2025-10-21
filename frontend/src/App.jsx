import React from "react";
import SignUp from "./mainComponents/signUp.jsx";
import {BrowserRouter,Routes,Route} from "react-router-dom"
import UserName from "./mainComponents/UserName.jsx";
const App=()=>{
  return (
    <BrowserRouter>
    <Routes>    
    <Route path="/" element={<SignUp />}/>
    <Route path="/UserName" element={<UserName/>}/> 
    </Routes>
    </BrowserRouter>
  );
};
export default App;
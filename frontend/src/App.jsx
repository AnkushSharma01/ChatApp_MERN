<<<<<<< HEAD
import Login from './login/Login.jsx';
=======
import Login from "./login/Login.jsx";
>>>>>>> a5089f1273093310fa936bc2ad239831f22b292c
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from "react-router-dom";
import Register from './register/register.jsx';
import Home from "./home/Home.jsx";
import {VerifyUser}  from "./utils/VerifyUser.jsx";

function App() {
  

  return (
    <>
     <div className="p-2 w-screen h-screen flex items-center justify-center">
      <Routes>
        
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route element={<VerifyUser/>}>
        <Route path="/" element={<Home/>}/>
        </Route>
      </Routes>
      <ToastContainer/>
     </div>
    </>
  )
}

export default App

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Redirect from "./pages/Redirect";
import Home from "./pages/Home";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/user/Dashboard';

function App() {

  return (

    <div>
      <BrowserRouter>
        <Routes>
          {/* Routes for Register and login*/}
          <Route path="/" element={<Redirect />} />
          <Route path="/unified-health-tech" element={<Home />} />
          <Route path="/unified-health-tech/register" element={<Register />} />
          <Route path="/unified-health-tech/login" element={<Login />} />


          {/* Routes for user dashboard */}
          <Route path="/unified-health-tech/user/dashboard/:userId" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>


  )
}

export default App

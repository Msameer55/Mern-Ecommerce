import React from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Profile from "./components/pages/Profile";
import CollectionPage from "./components/Products/CollectionPage";

const App = () => {
  return (
    <>
      <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000}/>
        <Routes>
          {/* User Layout */}
          <Route path="/" element={<UserLayout />}>
            <Route exact path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/collections/:collection" element={<CollectionPage />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route>{/* Admin Layout  */}</Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;

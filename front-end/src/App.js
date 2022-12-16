import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useRef, useState, useContext } from "react";
import { AuthProvider } from "./firebase/Auth";
import CurrentLocationLngLat from "./components/CurrentLocationLngLatContext";

import Home from "./components/Home";
import Detail from "./components/Detail";
import MyPosts from "./components/MyPosts";
import Profile from "./components/Profile";
import NewPost from "./components/NewPost";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Navigation from "./components/Navigation";
import EditPost from "./components/EditPost";
import CurrentLocationLngLatContext from "./components/CurrentLocationLngLatContext";
import ChangePassword from "./components/ChangePassword";
import SignOut from "./components/SignOut";

function App() {
  const lnglat = useRef([-74.0254848, 40.7446316]);

  return (
    <AuthProvider>
      <CurrentLocationLngLatContext.Provider value={lnglat}>
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/MyPosts" element={<MyPosts />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/NewPost" element={<NewPost />} />
            <Route path="/Detail" element={<Detail />} />
            <Route path="/Edit" element={<EditPost />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/SignUp" element={<SignUp />} />
          </Routes>
        </BrowserRouter>
      </CurrentLocationLngLatContext.Provider>
    </AuthProvider>
  );
}

export default App;

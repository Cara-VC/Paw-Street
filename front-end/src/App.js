import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react'
import { AuthProvider } from "./firebase/Auth";

import Home from './components/Home';
import Detail from './components/Detail';
import MyPosts from './components/MyPosts';
import Notification from './components/Notification';
import Profile from './components/Profile';
import NewPost from './components/NewPost';
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import Navigation from "./components/Navigation";
import EditPost from "./components/EditPost";


function App() {

  return (
      <AuthProvider>
          <BrowserRouter>
              {/*<Navbar bg="light" expand="lg">*/}
              {/*    <Container>*/}
              {/*        <Navbar.Brand href="/">Paw Street</Navbar.Brand>*/}
              {/*        <Navbar.Toggle aria-controls="basic-navbar-nav" />*/}
              {/*        <Navbar.Collapse id="basic-navbar-nav">*/}
              {/*            <Nav className="me-auto">*/}
              {/*                <Nav.Link href="/MyPosts">My Posts</Nav.Link>*/}
              {/*                <Nav.Link href="/Notification">Notification</Nav.Link>*/}
              {/*                <Nav.Link href="/Profile">Profile</Nav.Link>*/}
              {/*                <Nav.Link href="/NewPost">New Post</Nav.Link>*/}
              {/*                <Nav.Link href="/Detail">temp</Nav.Link>*/}
              {/*            </Nav>*/}
              {/*        </Navbar.Collapse>*/}
              {/*    </Container>*/}
              {/*</Navbar>*/}

              <Navigation />
            {/*<Container>*/}
            {/*  <NavLink to="/">Home</NavLink>&nbsp;&nbsp;&nbsp;*/}
            {/*  <NavLink to="/MyPosts">My Posts</NavLink>&nbsp;&nbsp;&nbsp;*/}
            {/*  <NavLink to="/Notification">Notification</NavLink>&nbsp;&nbsp;&nbsp;*/}
            {/*  <NavLink to="/Profile">Profile</NavLink>&nbsp;&nbsp;&nbsp;*/}
            {/*  <NavLink to="/NewPost">New Post</NavLink>&nbsp;&nbsp;&nbsp;*/}
            {/*  <NavLink to="/Detail">temp</NavLink>&nbsp;&nbsp;&nbsp;*/}
            {/*</Container>*/}

            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/MyPosts' element={<MyPosts />} />
              <Route path='/Notification' element={<Notification />} />
                <Route path="/Profile" element={<PrivateRoute />} >
                    <Route path="/Profile" element={<Profile />} />
                </Route>
              <Route path='/NewPost' element={<NewPost />} />
              <Route path='/Detail' element={<Detail />} />
              <Route path='/Edit' element={<EditPost />} />
              <Route path="/SignIn" element={<SignIn />} />
              <Route path="/SignUp" element={<SignUp />} />
            </Routes>
          </BrowserRouter>
      </AuthProvider>

  );
}

export default App

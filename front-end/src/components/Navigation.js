import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SignOutButton from "./SignOut";
import "../App.css";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navigation = () => {
  const auth = getAuth();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  const NavigationAuth = () => {
    return (
        <Navbar bg="light" expand="lg">
          <Container>

              <nav className="navigation">
                <NavLink to="/">Paw Street</NavLink>
                <NavLink to="/MyPosts">My Posts</NavLink>
                <NavLink to="/Notification">Notification</NavLink>
                <NavLink to="/Profile">Profile</NavLink>
                <NavLink to="/NewPost">New Post</NavLink>
                <NavLink to="/Detail">temp</NavLink>
                <NavLink to="/Edit">temp2</NavLink>
              </nav>

          </Container>
        </Navbar>
    );
  };

  const NavigationNonAuth = () => {
    return (
        <Navbar bg="light" expand="lg">
          <Container>
              <nav className="navigation">
                <NavLink to="/">Paw Street</NavLink>
                <NavLink to="/SignIn">Sign In</NavLink>
                <NavLink to="/SignUp">Sign Up</NavLink>
                <NavLink to="/Detail">temp</NavLink>
              </nav>
          </Container>
        </Navbar>
    );
  };

  if (loggedIn) return <NavigationAuth />;
  else return <NavigationNonAuth />;
};
export default Navigation;

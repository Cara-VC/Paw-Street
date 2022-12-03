import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SignOutButton from "./SignOut";
import "../App.css";

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
      <nav className="navigation">
        <ul>
          <li>
            <NavLink to="/">Landing</NavLink>
          </li>
          <li>
            <NavLink to="/home">Home</NavLink>
          </li>
          <li>
            <NavLink to="/account">Account</NavLink>
          </li>
          <li>
            <SignOutButton />
          </li>
        </ul>
      </nav>
    );
  };

  const NavigationNonAuth = () => {
    return (
      <nav className="navigation">
        <ul>
          <li>
            <NavLink to="/">Landing</NavLink>
          </li>
          <li>
            <NavLink to="/signup">Sign-up</NavLink>
          </li>
          <li>
            <NavLink to="/signin">Sign-In</NavLink>
          </li>
        </ul>
      </nav>
    );
  };

  if (loggedIn) return <NavigationAuth />;
  else return <NavigationNonAuth />;
};
export default Navigation;

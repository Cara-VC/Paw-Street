import React, { useEffect, useState } from "react";
import SignOutButton from "./SignOut";
import "../App.css";
import ChangePassword from "./ChangePassword";
import { getAuth } from "firebase/auth";
import { Navigate } from "react-router-dom";

function Account() {
  const auth = getAuth();
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  if (setLoggedIn) {
    return (
      <div>
        <h2>Account Page</h2>
        <ChangePassword />
        <SignOutButton />
      </div>
    );
  } else {
    return <Navigate to="/" />;
  }
}

export default Account;

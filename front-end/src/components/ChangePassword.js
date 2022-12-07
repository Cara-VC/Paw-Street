import React, { useContext, useState } from "react";
import { AuthContext } from "../firebase/Auth";
import { doChangePassword, doSignOut } from "../firebase/FirebaseFunctions";
import "../App.css";
import { getAuth } from "firebase/auth";
import { Navigate } from "react-router-dom";

function ChangePassword() {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [pwMatch, setPwMatch] = useState("");
  //console.log("changepsed curuser 1", currentUser);

  const submitForm = async (event) => {
    event.preventDefault();
    const { currentPassword, newPasswordOne, newPasswordTwo } =
      event.target.elements;

    if (newPasswordOne.value !== newPasswordTwo.value) {
      setPwMatch("New Passwords do not match, please try again");
      return false;
    }

    try {
      await doChangePassword(
        currentUser.email,
        currentPassword.value,
        newPasswordOne.value
      );
      //console.log("chagepswd curuser 2", auth.currentUser);
      alert("Password has been changed, you will now be logged out");
      await doSignOut();
    } catch (error) {
      alert(error);
    }
  };
  //console.log("chagepswd curuser 3", auth.currentUser);
  if (auth.currentUser === null) {
    //console.log("chagepswd curuser 3", currentUser.providerData[0].providerId);
    return <Navigate to="/" />;
  }
  if (currentUser.providerData[0].providerId === "password") {
    return (
      <div>
        {pwMatch && <h4 className="error">{pwMatch}</h4>}
        <h2>Change Password</h2>
        <form onSubmit={submitForm}>
          <div className="form-group">
            <label>
              Current Password:
              <input
                className="form-control"
                name="currentPassword"
                id="currentPassword"
                type="password"
                placeholder="Current Password"
                autoComplete="off"
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              New Password:
              <input
                className="form-control"
                name="newPasswordOne"
                id="newPasswordOne"
                type="password"
                placeholder="Password"
                autoComplete="off"
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Confirm New Password:
              <input
                className="form-control"
                name="newPasswordTwo"
                id="newPasswordTwo"
                type="password"
                placeholder="Confirm Password"
                autoComplete="off"
                required
              />
            </label>
          </div>

          <button type="submit">Change Password</button>
        </form>
        <br />
      </div>
    );
  } else {
    return (
      <div>
        <h2>
          You are signed in using a Social Media Provider, You cannot change
          your password
        </h2>
      </div>
    );
  }
}

export default ChangePassword;

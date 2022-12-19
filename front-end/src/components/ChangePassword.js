import React, { useContext, useState } from "react";
import { AuthContext } from "../firebase/Auth";
import { doChangePassword, doSignOut } from "../firebase/FirebaseFunctions";
import "../App.css";
import { getAuth } from "firebase/auth";
import { Navigate } from "react-router-dom";
import {checkTitle, checkUserId, checkUserName, checkStatus, checkContent, checkPetName, 
  checkLongitude, checkLatitude, checkImage, checkPassword, checkEmail, checkNewPassword} from "./validation/validation"

function ChangePassword() {
  const auth = getAuth();
  // const currentUser = auth.currentUser;
  const { currentUser } = useContext(AuthContext);
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
        checkEmail(currentUser.email),
        currentPassword.value,
        checkNewPassword(newPasswordOne.value)
      );
      //console.log("chagepswd curuser 2", auth.currentUser);
      alert("Password has been changed, you will now be logged out");
      await doSignOut();
    } catch (error) {
      if (error.code==="auth/wrong-password") alert("The current password is wrong. Please input it again.")
      else if (error.code==="auth/too-many-requests") alert("Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. ")
      else if (!error.message) alert(error)
      else alert(error.message);
    }
  };
  //console.log("chagepswd curuser 3", auth.currentUser);
  
  // console.log(currentUser)
  if (currentUser === null) {
    //console.log("chagepswd curuser 3", currentUser.providerData[0].providerId);
    return <Navigate to="/" />;
  } else if (currentUser && currentUser.providerData[0].providerId === "password") {
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

          <br />
          <span>The new password should contain upper and lower case letters, 
            numbers and special symbols '`_!@#$%^&*~()-+=', and the length between 8-30 bits.</span>
          <br />
          <br />
          <button type="submit">Change Password</button>
        </form>
        <br />
      </div>
    );
  } else {
    return (
      <div>
        <span>
          You are signed in using a Social Media Provider, You cannot change
          your password on this page!
        </span>
      </div>
    );
  }
}

export default ChangePassword;

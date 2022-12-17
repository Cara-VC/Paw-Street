import React, { useContext } from "react";
import SocialSignIn from "./SocialSignIn";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import {
  doSignInWithEmailAndPassword,
  doPasswordReset,
} from "../firebase/FirebaseFunctions";
import { getAuth } from "firebase/auth";
import {checkTitle, checkUserId, checkUserName, checkStatus, checkContent, checkPetName, 
  checkLongitude, checkLatitude, checkImage, checkPassword, checkEmail} from "./validation/validation"

function SignIn() {
  const auth = getAuth();
  const { currentUser } = useContext(AuthContext);
  const handleLogin = async (event) => {
    event.preventDefault();
    let { email, password } = event.target.elements;

    try {
      await doSignInWithEmailAndPassword(checkEmail(email.value), password.value);
      // setCurrentUser(auth.currentUser);
    } catch (error) {
      if (error.code==="auth/user-not-found") alert("This email have not sign up. Please sign up first.")
      else if (error.code==="auth/wrong-password") alert("Username and password do not match. Please check your input.")
      else if (error.code==="auth/too-many-requests") alert("Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. ")
      else alert(error.message);
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();
    let email = document.getElementById("email").value;
    // if (email) {
    //   doPasswordReset(email);
    //   alert("Password reset email was sent");
    // } else {
    //   alert(
    //     "Please enter an email address below before you click the forgot password link"
    //   );
    // }

    if (!email) {
      alert("Please enter an email address below before you click the forgot password link");
      return
    }
    async function setPW(){
      let ifSend=false
      try{
        ifSend = await doPasswordReset(checkEmail(email));
      } catch(error){
        if (!error.message) alert(error)
        else alert(error.message)
      }
      if(ifSend) alert("Password reset email was sent");
    }
    setPW()
  };
  if (currentUser) {
    return <Navigate to="/" />;
  }
  return (
    <div className="container">
      <h1>Log in</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>
            Email:
            <input
              className="form-control"
              name="email"
              id="email"
              type="email"
              placeholder="Email"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Password:
            <input
              className="form-control"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="off"
              required
            />
          </label>
        </div>
        <button type="submit">Log in</button>

        <button className="forgotPassword" onClick={passwordReset}>
          Forgot Password
        </button>
      </form>

      <br />
      <SocialSignIn />
    </div>
  );
}

export default SignIn;

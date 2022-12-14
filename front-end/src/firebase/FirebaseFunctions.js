import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  EmailAuthProvider,
  updatePassword,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./Firebase";

async function doCreateUserWithEmailAndPassword(email, password, displayName) {
  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      updateProfile(user, { displayName: displayName });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      //console.log(errorCode, errorMessage);
      if (errorCode==="auth/email-already-in-use") alert("The email is already used, please login")
      else alert(errorMessage);
    });
}

async function doChangePassword(email, oldPassword, newPassword) {
  let credential = EmailAuthProvider.credential(email, oldPassword);
  await reauthenticateWithCredential(auth.currentUser, credential);
  await updatePassword(auth.currentUser, newPassword);
  await doSignOut();
}

async function doSignInWithEmailAndPassword(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
}

async function doSocialSignIn(provider) {
  let socialProvider = null;
  if (provider === "google") {
    socialProvider = new GoogleAuthProvider();
  } else if (provider === "facebook") {
    socialProvider = new FacebookAuthProvider();
  }
  await signInWithPopup(auth, socialProvider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      alert(errorMessage);
    });
}

async function doPasswordReset(email) {
  let ifSend=true
  await sendPasswordResetEmail(auth, email)
  .catch((error) => {
    ifSend=false
    const errorCode = error.code;
    const errorMessage = error.message;
    if(errorCode==="auth/user-not-found") alert("The email have not been sign up. Please sign up first.");
    else if (errorCode==="auth/invalid-email") alert("The email address is invalid. Please check.")
    else alert(errorMessage)
  });
  return ifSend
}

async function doSignOut() {
  await signOut(auth);
}

export {
  doCreateUserWithEmailAndPassword,
  doSocialSignIn,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doSignOut,
  doChangePassword,
};

import React, {useContext, useEffect, useState} from "react";
import SignOutButton from "./SignOut";
import "../App.css";
import ChangePassword from "./ChangePassword";
import { Navigate } from "react-router-dom";
import {AuthContext} from '../firebase/Auth';
import {Container} from "react-bootstrap";
import { doChangePassword, doSignOut } from "../firebase/FirebaseFunctions";

function Profile() {

    const { currentUser } = useContext(AuthContext);
    // const [pwMatch, setPwMatch] = useState("");
    // //console.log("changepsed curuser 1", currentUser);
    //
    // const submitForm = async (event) => {
    //     event.preventDefault();
    //     const { currentPassword, newPasswordOne, newPasswordTwo } =
    //         event.target.elements;
    //
    //     if (newPasswordOne.value !== newPasswordTwo.value) {
    //         setPwMatch("New Passwords do not match, please try again");
    //         return false;
    //     }
    //
    //     try {
    //         await doChangePassword(
    //             currentUser.email,
    //             currentPassword.value,
    //             newPasswordOne.value
    //         );
    //         //console.log("chagepswd curuser 2", auth.currentUser);
    //         alert("Password has been changed, you will now be logged out");
    //         await doSignOut();
    //     } catch (error) {
    //         alert(error);
    //     }
    // };
    if (currentUser) {
        return(
            <Container>
                <h1>Profile</h1>
                <h2>Hello, {currentUser.displayName}</h2>
                <ChangePassword />
                <SignOutButton />
            </Container>
        );

    } else {
        return <Navigate to="/signin" />;
    }

}

export default Profile;

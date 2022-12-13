import React, {useContext, useEffect, useState} from "react";
import SignOutButton from "./SignOut";
import "../App.css";
import ChangePassword from "./ChangePassword";
import { getAuth } from "firebase/auth";
import { Navigate } from "react-router-dom";
import {AuthContext} from '../firebase/Auth';

function Profile() {

    const { currentUser } = useContext(AuthContext);
    // const auth = getAuth();
    // const [loggedIn, setLoggedIn] = useState(true);
    // const user = auth.currentUser;
    // useEffect(() => {
    //     auth.onAuthStateChanged((user) => {
    //         if (user) {
    //             setLoggedIn(true);
    //         } else {
    //             setLoggedIn(false);
    //         }
    //     });
    // }, []);

    // if (!currentUser) {
    //     return <Navigate to="/signin" />;
    // }

    if (currentUser) {
        //console.log("PrivateRouteOutlet");

        return(
            <div className="container">
                <h2>Profile</h2>
                <h3>Hello, {currentUser.displayName}</h3>
                <ChangePassword />
                <SignOutButton />
            </div>
        );

    } else {
        return <Navigate to="/signin" />;
    }

}

export default Profile;

import React from 'react';
import {doSignOut} from '../firebase/FirebaseFunctions';
import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const SignOutButton = () => {
  return (

          <button type='button' onClick={doSignOut}>
              Sign Out
          </button>


  );
};

export default SignOutButton;

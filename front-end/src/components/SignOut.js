import React, {useContext} from 'react';
import {doSignOut} from '../firebase/FirebaseFunctions';
import { Navigate } from "react-router-dom";
import {AuthContext} from '../firebase/Auth';
import {Button} from "react-bootstrap";

const SignOutButton = () => {
    const { currentUser } = useContext(AuthContext);
  return (

          <Button variant="secondary" onClick={doSignOut}>
              Sign Out
          </Button>

  );
};

export default SignOutButton;

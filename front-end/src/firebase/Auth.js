import React, {useContext, useEffect, useState} from "react";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { auth } from "./Firebase";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  // useEffect(() => {
  //   return auth.onIdTokenChanged((user) => {
  //     if (user) {
  //       //console.log("user");
  //       setLoadingUser(false);
  //       setCurrentUser(user);
  //     } else {
  //       //console.log("no user");
  //       setLoadingUser(true);
  //       return;
  //     }
  //   });
  // }, []);
  //
  // return <AuthContext.Provider value={{currentUser}}>{children}</AuthContext.Provider>;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unsub();
    };
  });
  return <AuthContext.Provider value={{currentUser}}>{children}</AuthContext.Provider>;


};

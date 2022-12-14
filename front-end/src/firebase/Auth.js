import React, {useContext, useEffect, useState} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => {
      unsub();
    };
  });
  return (<AuthContext.Provider value={{currentUser}}>{children}</AuthContext.Provider>);


};

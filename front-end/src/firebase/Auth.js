import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    return auth.onIdTokenChanged((user) => {
      if (user) {
        //console.log("user");
        setLoadingUser(false);
        setCurrentUser(user);
      } else {
        //console.log("no user");
        setLoadingUser(true);
        return;
      }
    });
  }, []);

  // if (loadingUser) {
  //   return (
  //     <div>
  //       <h1>Loading....Loading....Loading....Loading....Loading....</h1>
  //     </div>
  //   );
  // }

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

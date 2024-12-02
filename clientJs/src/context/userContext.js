import React from "react";

const userContext = React.createContext({
  user: {
    userID: "1",
    isAdmin: 0,
    role: "no user",
  },
  setUser: () => {}, // A dummy function, will be replaced by the actual function in App.js
});

export default userContext;

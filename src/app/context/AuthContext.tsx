"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type AuthContextType = {
  loggedIn: boolean;
  setLoggedIn: (val: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
  loggedIn: false,
  setLoggedIn: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await fetch("/api/session");
        const data = await res.json();
        setLoggedIn(data.loggedIn);
      } catch (error) {
        setLoggedIn(false);
      }
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

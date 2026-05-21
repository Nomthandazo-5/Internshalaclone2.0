'use client';

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/router";

const firebaseConfig = {
  apiKey: "AIzaSyAPgauOeJrNMB_Cf752rWZdOLjzPXfxdLg",
  authDomain: "internarea-72e3f.firebaseapp.com",
  projectId: "internarea-72e3f",
  storageBucket: "internarea-72e3f.firebasestorage.app",
  messagingSenderId: "684737432740",
  appId: "1:684737432740:web:130d908037d58ea1abaa31"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

const AuthContext = createContext<any>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        const allowedPaths = ['/internship', '/adminpanel', '/profile', '/signin', '/', '/job'];
        const isDetailPage = router.pathname.startsWith('/detailinternship') ||
          router.pathname.startsWith('/detailjob');

        if (!allowedPaths.includes(router.pathname) && !isDetailPage) {
          router.push('/internship');
        }
      }
    });

    return () => unsubscribe();
  }, [router.pathname]);
  
  const value = {
    currentUser,
    logout: () => signOut(auth)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { auth, googleProvider, db };
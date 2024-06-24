import {Router, RouterProvider} from "react-router-dom";
import React, { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/FirebaseInstance';
import {useAuthStore} from './store/AuthStore';
import {useUserStore} from './store/UserStore';
import './App.css';
import root from "./router/root"

function App() {
  const { setUserState } = useAuthStore();
  const { setUserData } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserState({ user, isLoading: false });

      if(!user){
        setUserData({ id: null, role: null, replacedId : null });
      }
    });
    return () => unsubscribe();
  }, []);
  

  return (
    
      <div className="bg-main h-screen overflow-y-scroll scrollbar-hide">

        <div className=" bg-main scrollbar-hide">
          <RouterProvider router={root}/>
        </div>
        
      </div>
      
    
  
  );
}

export default App;

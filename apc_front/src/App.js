import {Router, RouterProvider} from "react-router-dom";
import React, { useEffect } from 'react';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from './firebase/FirebaseInstance';
import {useAuthStore} from './store/AuthStore';
import {useUserStore} from './store/UserStore';
import './App.css';
import root from "./router/root"

const {
  REACT_APP_NGROK_URL
} = process.env;

function App() {
  const { isLoading, setUserState } = useAuthStore();
  const { setUserData } = useUserStore();

  useEffect(() => {
    // const unsubscribe = onAuthStateChanged(auth, (user) => {
    //   setUserState({ user, isLoading: false });

    //   if(!user){
    //     setUserData({ id: null, role: null, replacedId : null });
    //   }
    // });
    // return () => unsubscribe();
    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/refreshed', { 
              credentials: 'include',
            });
            if (!response.ok) {
              setUserData({ id: null, role: null });
              setUserState(null, false);
            } else {
              const data = await response.json();
              const user = { id: data.userId, role: data.loggedInUserRole };
              setUserData(user);
              setUserState(user, false);
            }
        } catch (error) {
            console.error('Not authenticated', error);
            setUserData({ id: null, role: null });
            setUserState(null, false);
        }
    };

    checkAuth();
  }, []);
  
  if (isLoading) return(
    <div className="flex items-center justify-center min-h-screen bg-main h-screen overflow-y-scroll scrollbar-hide">

      <div className=" bg-main scrollbar-hide">
        <div id="loading-spinner" className="flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
      
    </div>
  ) ; // 시작 로딩 화면 넣을 것

  return (
    
      <div className="bg-main h-screen overflow-y-scroll scrollbar-hide">

        <div className=" bg-main scrollbar-hide">
          <RouterProvider router={root}/>
        </div>
        
      </div>
  );
}

export default App;

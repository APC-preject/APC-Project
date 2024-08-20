import {Router, RouterProvider} from "react-router-dom";
import React, { useEffect, useState } from 'react';
import './App.css';
import root from "./router/root"

function App() {
  const [isLoading , setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
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

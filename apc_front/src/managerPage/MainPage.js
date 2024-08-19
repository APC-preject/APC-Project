import React, { useState, useEffect } from 'react';
import BasicLayout from '../layout/BasicLayout';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {

      } catch (error) {
        console.error('Error fetching product list:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <BasicLayout>
      <div className="flex-wrap bg-main">
        <div className="p-5 border-dashed rounded-lg border-gray-700 mt-14">
          <div className="max-w-[96rem] min-w-[18rem] mx-auto text-container">
            <div className="bg-cover bg-center" style={{ backgroundSize: 'contain', backgroundRepeat: 'no-repeat', height: 800, backgroundImage: 'url(/assets/videocutcut.gif)' }}></div>
          </div>
        </div>
      </div>
    </BasicLayout>
  )
}

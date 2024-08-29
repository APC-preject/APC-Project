import React, { useState } from 'react';
import BasicLayout from '../layout/BasicLayout';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNavigation = (path) => {
    if (path === '/' || path === '/producer' || path === '/customer') {
      window.location.href = path; // 도메인이 동일하지만 다른 앱으로 리다이렉트
    } else {
      navigate(path);
    }
  };

  return (
    <BasicLayout>
      <div className="flex-wrap bg-main">
        <div className="p-5 border-dashed rounded-lg border-gray-700 mt-14">
          <div className="max-w-[96rem] min-w-[18rem] mx-auto text-container">
            <div className="bg-cover bg-center" style={{ backgroundSize: 'contain', backgroundRepeat: 'no-repeat', height: 800, backgroundImage: 'url(/assets/videocutcut.gif)' }}></div>
          </div>
        </div>
      </div>
      <div className="absolute top-20 right-5">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg"
          onClick={handleDropdownToggle}
        >
          로그인
        </button>
        {isDropdownOpen && (
          <div className="mt-2 bg-white shadow-lg rounded-md w-48">
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
              onClick={() => handleNavigation('/')}
            >
              관리자 로그인
            </button>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
              onClick={() => handleNavigation('/producer')}
            >
              재배자 로그인
            </button>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
              onClick={() => handleNavigation('/customer')}
            >
              고객사 로그인
            </button>
          </div>
        )}
      </div>
    </BasicLayout>
  );
}

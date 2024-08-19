import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

const MainPage = ({ customer }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  }

  return (
    <div className='main-container'>
      <h1 className='title'>출고 예약 페이지</h1>
      <p className="customer-info">현재 접속 중인 고객사: {customer}</p>
      <div className="button-group">
        <button className='btn-reservation' onClick={() => navigate('/customer/reservation')}>예약하기</button>
        <button className='btn-list' onClick={() => navigate('/customer/reservation-list')}>예약목록</button>
        <button className='btn-logout' onClick={handleLogout}>로그아웃</button>
      </div>
    </div>
  );
};

export default MainPage;

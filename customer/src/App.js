import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Auth from './component/Auth';
import MainPage from './component/MainPage';
import Reservation from './component/Reservation';
import ReservationList from './component/ReservationList';
import PrivateRoute from './component/PrivateRoute';
import GenerateToken from './component/GenerateToken';
import TokenAuth from './component/TokenAuth';
import { database, onValue, ref } from './FirebaseInstance';
import axios from 'axios';
import './App.css';

function App() {
  const [customer, setCustomer] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const isAuthenticated = customer !== '';
  const [notification, setNotification] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    console.log("customer");
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      verifyToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const reservationsRef = ref(database, 'reservations');
    const unsubscribe = onValue(reservationsRef, (snapshot) => {
      const newnotification = [];
      snapshot.forEach((childSnapshot) => {
        const reservation = childSnapshot.val();
        if (reservation.customer === customer && reservation.accept !== 0) {
          const formattedDate = parseDate(reservation.date);
          newnotification.push({
            id: childSnapshot.key,
            message: `예약이 ${reservation.accept === 1 ? '승인' : '거절'}되었습니다.`,
            date: formattedDate,
          });
        }
      });
      setNotification(newnotification);
    });

    return () => unsubscribe();
  }, [customer]);

  const parseDate = (dateString) => {
    if (!dateString) return 'Invalid date';
    const dateParts = dateString.match(/(\d+)\. (\d+)\. (\d+)\./);
    const timeParts = dateString.match(/(오전|오후) (\d+):(\d+)/);
    if (!dateParts || !timeParts) return 'Invalid date';

    let [_, year, month, day] = dateParts;
    let [__, period, hour, minute] = timeParts;

    if (period === '오후' && hour !== '12') hour = parseInt(hour) + 12;
    if (period === '오전' && hour === '12') hour = 0;

    const formattedDate = new Date(year, month - 1, day, hour, minute);
    return `${formattedDate.getMonth() + 1}/${formattedDate.getDate()}`;
  };

  const verifyToken = async (token) => {
    try {
      const response = await axios.post('/token/verify', { token });
      setCustomer(response.data.customer);
    } catch (error) {
      localStorage.removeItem('authToken');
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const deleteNotification = (id) => {
    setNotification(notification.filter((notification) => notification.id !== id));
  };

  return (
    <Router>
      <div>
        <header className="app-header">
          {isAuthenticated && (
            <div className="notification-button">
              <button onClick={toggleDropdown}>
                알림 ({notification.length})
              </button>
              {showDropdown && (
                <div className="notification-dropdown">
                  {notification.length === 0 && <p>새로운 알림이 없습니다.</p>}
                  {notification.map((notification) => (
                    <div key={notification.id} className="notification-item">
                      <span>{notification.date} - {notification.message}</span>
                      <button onClick={() => deleteNotification(notification.id)}>삭제</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </header>
        <Routes>
          <Route path="/" element={<Navigate to="/customer" />} />
          <Route path="/customer" element={<Auth setCustomer={setCustomer} />} />
          <Route path="/customer/token-auth" element={<TokenAuth setIsAdminAuthenticated={setIsAdminAuthenticated} />} />
          <Route path="/customer/generate-token" element={isAdminAuthenticated ? <GenerateToken /> : <Navigate to="/customer/token-auth" />} />
          <Route path="/customer/Main" element={<PrivateRoute element={<MainPage customer={customer} />} isAuthenticated={isAuthenticated} />} />
          <Route path="/customer/reservation" element={<PrivateRoute element={<Reservation customer={customer} />} isAuthenticated={isAuthenticated} />} />
          <Route path="/customer/reservation-list" element={<PrivateRoute element={<ReservationList customer={customer} />} isAuthenticated={isAuthenticated} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
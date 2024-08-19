import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { app } from '../FirebaseInstance';
import './ReservationList.css';

const ReservationList = ({ customer }) => {
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();
  const database = getDatabase(app);

  useEffect(() => {
    const fetchReservations = async () => {
      const reservationsRef = ref(database, 'reservations');
      const snapshot = await get(reservationsRef);
      if (snapshot.exists()) {
        const reservationsList = [];
        snapshot.forEach((childSnapshot) => {
          const reservation = childSnapshot.val();
          if (reservation.customer === customer) {
            reservationsList.push(reservation);
          }
        });
        reservationsList.reverse();
        setReservations(reservationsList);
      }
    };
    fetchReservations();
  }, [database, customer]);

  const getStatusText = (accept) => {
    switch (accept) {
      case 0:
        return "승인대기중";
      case 1:
        return "승인";
      case 2:
        return "거절";
      default:
        return "";
    }
  };

  const getStatusClassName = (accept) => {
    switch (accept) {
      case 0:
        return "status-pending";
      case 1:
        return "status-accepted";
      case 2:
        return "status-rejected";
      default:
        return "";
    }
  };

  const last_idx = currentPage * itemsPerPage;
  const first_idx = last_idx - itemsPerPage;
  const curReservations = reservations.slice(first_idx, last_idx);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(reservations.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container">
      <h1>예약목록 페이지</h1>
      <ul className="reservation-list">
        {curReservations.map((reservation, index) => (
          <li key={index} className="reservation-item">
            <span><strong>1:</strong> {reservation[1]}</span>
            <span><strong>2:</strong> {reservation[2]}</span>
            <span><strong>3:</strong> {reservation[3]}</span>
            <span><strong>4:</strong> {reservation[4]}</span>
            <span><strong>5:</strong> {reservation[5]}</span>
            <span><strong>6:</strong> {reservation[6]}</span>
            <span><strong>7:</strong> {reservation[7]}</span>
            <span><strong>날짜:</strong> {reservation.date}</span>
            <span><strong>고객사:</strong> {reservation.customer}</span>
            <span className={getStatusClassName(reservation.accept)}><strong>상태:</strong> {getStatusText(reservation.accept)}</span>
          </li>
        ))}
      </ul>
      <div className='pagination'>
        {pageNumbers.map(number => (
          <button key={number} onClick={() => setCurrentPage(number)} className={number === currentPage ? 'active' : ''}>
            {number}
          </button>
        ))}
      </div>
      <div className="button-group">
        <button onClick={() => navigate('/customer/Main')}>돌아가기</button>
      </div>
    </div>
  );
};

export default ReservationList;

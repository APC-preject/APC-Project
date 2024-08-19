import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getDatabase, ref, push } from 'firebase/database';
import { app } from '../FirebaseInstance';
import './Reservation.css';

const Reservation = ({ customer }) => {
  const [formData, setFormData] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', date: new Date() });
  const [placeholder, setPlaceholder] = useState({
    1: "수량을 입력해주세요...",
    2: "수량을 입력해주세요...",
    3: "수량을 입력해주세요...",
    4: "수량을 입력해주세요...",
    5: "수량을 입력해주세요...",
    6: "수량을 입력해주세요...",
    7: "수량을 입력해주세요..."
  })

  const navigate = useNavigate();
  const database = getDatabase(app);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    setPlaceholder({ ...placeholder, [name]: '' });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (formData[name] === '') {
      setPlaceholder({ ...placeholder, [name]: '수량을 입력해주세요...' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reservationsRef = ref(database, 'reservations');
      await push(reservationsRef, {
        ...formData,
        date: formatDate(formData.date),
        customer: customer,
        accept: 0
      });
      navigate('/customer/reservation-list');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('예약을 등록하는데 실패했습니다.');
    }
  };

  return (
    <div className="container">
      <h1>예약 페이지</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="1">1</label>
          <input type="number" id="1" name="1" value={formData.A} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} placeholder={placeholder[1]} required />
        </div>
        <div className="form-group">
          <label htmlFor="2">2</label>
          <input type="number" id="2" name="2" value={formData.A} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} placeholder={placeholder[2]} required />
        </div>
        <div className="form-group">
          <label htmlFor="2">3</label>
          <input type="number" id="3" name="3" value={formData.A} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} placeholder={placeholder[3]} required />
        </div>
        <div className="form-group">
          <label htmlFor="4">4</label>
          <input type="number" id="4" name="4" value={formData.A} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} placeholder={placeholder[4]} required />
        </div>
        <div className="form-group">
          <label htmlFor="5">5</label>
          <input type="number" id="5" name="5" value={formData.A} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} placeholder={placeholder[5]} required />
        </div>
        <div className="form-group">
          <label htmlFor="6">6</label>
          <input type="number" id="6" name="6" value={formData.A} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} placeholder={placeholder[6]} required />
        </div>
        <div className="form-group">
          <label htmlFor="7">7</label>
          <input type="number" id="7" name="7" value={formData.A} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} placeholder={placeholder[7]} required />
        </div>
        <div className="form-group">
          <label htmlFor="date">날짜:</label>
          <DatePicker
            selected={formData.date}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat="yyyy/MM/dd hh:mm a"
            className="datepicker"
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">예약하기</button>
          <button type="button" onClick={() => navigate('/customer/Main')}>돌아가기</button>
        </div>
      </form>
    </div>
  );
};

export default Reservation;

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Auth = ({ setCustomer }) => {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      verifyToken(storedToken);
    }
    inputRef.current.focus();
  }, []);

  const verifyToken = async (authToken) => {
    try {
      const response = await axios.post('/token/verify', { token: authToken });
      setCustomer(response.data.customer);
      navigate('/customer/Main');
    } catch (error) {
      localStorage.removeItem('authToken');
      setToken('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/token/verify', { token });
      setCustomer(response.data.customer);
      if (rememberMe) {
        localStorage.setItem('authToken', token);
      }
      navigate('/customer/Main');
    } catch (error) {
      alert('Invalid token');
      setToken('');
    }
  };

  return (
    <div className='container'>
      <h2 className='title'>토큰을 입력해주세요!</h2>
      <form onSubmit={handleSubmit}>
        <input
          type={showToken ? 'text' : 'password'}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="인증토큰을 입력해주세요..."
          ref={inputRef}
          className='token-input'
        />
        <label>
          <input
            type="checkbox"
            checked={!showToken}
            onChange={() => setShowToken(!showToken)}
          />
          숨기기
        </label>
        <div className="remember">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            로그인 유지
          </label>
        </div>
        <button type="submit">제출</button>
      </form>
    </div>
  );
};

export default Auth;

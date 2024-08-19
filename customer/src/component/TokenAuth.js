import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TokenAuth.css';

const TokenAuth = ({ setIsAdminAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const adminPassword = 'espresso';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsAdminAuthenticated(true);
      navigate('/customer/generate-token');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="token-auth-container">
      <h1>관리자 인증</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="관리자 비밀번호를 입력하세요"
          className="password-input"
          required
        />
        <button type="submit" className="submit-button">제출</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default TokenAuth;

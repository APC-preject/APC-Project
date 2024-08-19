import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GenerateToken.css';

const GenerateToken = () => {
  const [customer, setCustomer] = useState('');
  const [token, setToken] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const navigate = useNavigate();

  const handleGenerate = async () => {
    try {
      const response = await axios.post('/token/login', { customer });
      setToken(response.data.token);
      setCopySuccess('');
    } catch (error) {
      console.error('Error generating token:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token).then(() => {
      setCopySuccess('토큰 복사됨!');
    }, (err) => {
      setCopySuccess('토큰 복사 실패..');
    });
  };

  return (
    <div className="generate-token-container">
      <h1>토큰 생성기</h1>
      <input
        type="text"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
        placeholder="고객사 이름을 입력하세요"
        className="customer-input"
      />
      <button onClick={handleGenerate} className="generate-button">토큰 생성</button>
      {token && (
        <div className="token-display">
          <input type="text" value={token} readOnly className="token-input" />
          <button onClick={copyToClipboard} className="copy-button">복사</button>
          {copySuccess && <span className="copy-success">{copySuccess}</span>}
        </div>
      )}
      <button onClick={() => navigate('/customer')} className="back-button">메인페이지로 돌아가기</button>
    </div>
  );
};

export default GenerateToken;

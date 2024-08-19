import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("로그인이 완료되었습니다!");
      navigate('/producer/main');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/producer/signup');
  };

  return (
    <div className="container signin-container">
      <form onSubmit={handleSignIn}>
        <h1>로그인</h1>
        <input
          type="email"
          placeholder="아이디"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">로그인</button>
      </form>
      <button className="signup-button" onClick={handleSignUpRedirect}>회원가입</button>
    </div>
  );
};

export default SignIn;

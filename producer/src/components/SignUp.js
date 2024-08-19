import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { database } from '../FirebaseInstance';
import './SignUp.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    if (password.length < 6 || email.length < 6) {
      alert("아이디와 비밀번호는 6자리 이상이어야 합니다.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(database, 'users/' + user.uid), {
        name: name,
        email: email,
      });

      alert("회원가입이 완료되었습니다!");
      navigate('/producer/signin');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container signup-container">
      <form onSubmit={handleSignUp}>
        <h1>회원가입</h1>
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default SignUp;

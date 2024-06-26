import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { useNavigate } from "react-router-dom"
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app, getDatabase, databaseRef, update } from '../../firebase/FirebaseInstance';
const auth = getAuth(app);
const database = getDatabase(app);

export default function RegisterPage() { //Todo: APC관리자, 일반회원 버튼 선택에 따른 등록 버튼 분리 해야함 - 
  // 회원 가입 폼 상태 관리
  const [isProducer, setIsProducer] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [apcID, setApcID] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const online = 0

  const navigate = useNavigate()

  const handleClickMain = useCallback(() => {
    navigate({pathname:'/user/login'})
  },[navigate])

  // 회원 가입 처리 핸들러 
  const handleRegister = async () => {
    // 비밀번호와 확인 비밀번호가 일치하는지 확인
    if (password !== confirmPassword) {
      alert('비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }
  
    try {
      const userData = {
        email: email,
        name: name,
        password: password,
        role : 0
      };
    
      // 판매자인 경우 apcId와 online 여부 항목 추가
      if (isProducer) {
        userData['role'] = 1;
        userData['apcID'] = apcID;
        userData['online'] = 0;
      }
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('회원가입 실패'); ///// 에러처리
      }
      alert('회원가입이 완료되었습니다.');
      handleClickMain();
    } catch (error) {
      // 회원가입 실패 시 처리
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error creating user: ', errorCode, errorMessage);
      alert(`${errorCode}: ${errorMessage}`);
    }
  };




  return (
    <div className="flex h-screen">
      <Navbar className = "mb-5"/>
      <Sidebar/>
      <div className="flex-grow flex justify-center items-center pt-12 ">
        <div className="w-full max-w-md p-6 border rounded-lg border-none">
          <h2 className="text-2xl font-bold mb-4 text-sub">회원가입</h2>
          <div className="mb-4">
            <div className="flex space-x-2">

            <button
                type="button"
                className={`flex-1 py-2 border rounded-md shadow-sm text-sm font-medium text-sub border-bor ${
                  !isProducer
                    ? 'bg-button2 hover:bg-green-700'
                    : 'bg-main hover:bg-hov'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                onClick={() => setIsProducer(false)}
              >
                소비자
              </button>

              <button
                type="button"
                className={`flex-1 py-2 border rounded-md shadow-sm text-sm font-medium text-sub border-bor ${
                  isProducer
                    ? 'bg-button2 hover:bg-green-700'
                    : 'bg-main hover:bg-hov'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                onClick={() => setIsProducer(true)}
              >
                판매자
              </button>
              
            </div>
          </div>
          {isProducer ? (
            <>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-sub">
                  이메일
                </label>
                <input
                  type="text"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-textbg text-sub"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-sub">
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-textbg text-sub"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="apcID" className="block text-sm font-medium text-sub">
                  APC 아이디
                </label>
                <input
                  type="text"
                  id="apcID"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-textbg text-sub"
                  value={apcID}
                  onChange={(e) => setApcID(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-sub">
                  이메일
                </label>
                <input
                  type="text"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-textbg text-sub"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-sub">
                  이름
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-textbg text-sub"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </>
          )}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-sub">
              패스워드
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-textbg text-sub"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-sub">
              패스워드 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-textbg text-sub"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <button
              type="button"
              className="inline-block w-full py-2 border rounded-md shadow-sm text-sm font-medium text-white border-bor bg-button2 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={handleRegister}
            >
              등록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
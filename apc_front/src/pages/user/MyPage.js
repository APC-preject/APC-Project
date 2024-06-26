import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { useUserStore } from '../../store/UserStore';
import { useAuthStore } from '../../store/AuthStore';
import axios from 'axios';

export default function MyPage() {
  const [isProducer, setIsProducer] = useState(false);
  const { user } = useAuthStore();
  const { id, replaceId } = useUserStore();
  
  // 사용자 정보
  const [userInfo, setUserInfo] = useState({
    userId: replaceId(id),
    name: '',
    accountType: '',
  });

  useEffect(() => {
    const findUserById = async (id) => {
      try {
        const response = await axios.get(`http://localhost:4004/user/${id}`);
        const userData = response.data;
        if (userData.role === 0) {
          setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            name: userData.name,
            accountType: '일반 사용자 계정'
          }));
        } else if (userData.role === 1) {
          setIsProducer(true);
          setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            name: userData.name,
            accountType: '판매자 계정',
            apcId: userData.apcID
          }));
        } else {
          setUserInfo(prevUserInfo => ({
            ...prevUserInfo,
            name: userData.name,
            accountType: 'Unknown'
          }));
        }
      } catch (error) {
        console.error('사용자 데이터 가져오는 중 오류 발생:', error);
      }
    };

    findUserById(id);
  }, [id]);

  // 계정 정보 변경 상태 관리
  const [isEditingAccountInfo, setIsEditingAccountInfo] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 계정 정보 변경 버튼 클릭 핸들러
  const handleEditAccountInfo = () => {
    setIsEditingAccountInfo((prevState) => !prevState);
  };

  const handleSubmitAccountInfo = async () => {
    if (newPassword === confirmPassword) {
      try {
        const response = await axios.post(`http://localhost:4004/user/${id}/password`, {
          currentPassword,
          newPassword
        });
        alert('비밀번호 변경 완료');
      } catch (error) {
        console.error('비밀번호 변경 오류:', error.message);
        alert('비밀번호 변경 중 오류가 발생했습니다.');
      }
      setIsEditingAccountInfo(false);
    } else {
      alert('변경할 비밀번호를 동일하게 입력하여 주십시오.');
    }
  };

  if (!user || id == null) {
    return (
      <p className='pt-20 text-3xl text-baritem'>
        로그인 후 이용하십시오.
      </p>
    );
  }
  return (
    <div className="flex h-screen">
      <Navbar />
      <Sidebar />
      <div className="pt-20 flex-grow flex justify-center items-center boarder-none">
        <div className="w-full max-w-md p-6 border rounded-lg border-bor">
          <h2 className="text-2xl font-bold mb-4 text-sub">마이페이지</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-sub">유저 ID</label>
            <p className="mt-1 text-sub">{userInfo.userId}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-sub">이름</label>
            <p className="mt-1 text-sub">{userInfo.name}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-sub">계정 타입</label>
            <p className="mt-1 text-sub">{userInfo.accountType}</p>
          </div>
          {isProducer && (
            <div>
              <label className="block text-sm font-medium text-sub">APC명</label>
              <p className="mt-1 text-sub">{userInfo.apcId}</p>
            </div>
          )}
          <div className="mb-4 pt-3">
            <button
              type="button"
              className="inline-block w-full py-2 border rounded-md shadow-sm text-sm font-medium text-white border-bor bg-button hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleEditAccountInfo}
            >
              {isEditingAccountInfo ? '닫기' : '계정 정보 수정'}
            </button>
          </div>
          {isEditingAccountInfo && (
            <div className="mt-4">
              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-sub">
                  현재 패스워드
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-textbg text-sub"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-sub">
                  변경 패스워드
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-textbg text-sub"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-sub">
                  패스워드 확인
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="mt-1 block w-full rounded-md border-bor shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-textbg text-sub"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <button
                  type="button"
                  className="inline-block w-full py-2 border rounded-md shadow-sm text-sm font-medium text-white border-bor bg-button2 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={handleSubmitAccountInfo}
                >
                  수정
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

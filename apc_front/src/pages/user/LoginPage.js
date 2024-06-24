import React, { useState, useCallback, useEffect} from 'react'
import { useNavigate } from "react-router-dom"
import { getDatabase, ref, child, get } from "firebase/database";
import { auth } from "../../firebase/FirebaseInstance";
import { signInWithEmailAndPassword } from "firebase/auth"
import { useUserStore } from '../../store/UserStore';
import BasicLayout from '../../layout/BasicLayout';


export default function LoginPage() {
  const { setUserData } = useUserStore()

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleClickMain = useCallback(() => {
    navigate({pathname:'/'})
  },[navigate])

  const handleClickRegister = useCallback(() => {
    navigate({pathname:'/user/register'})
  },[navigate])

  // 엔터키 눌렀을때 로그인 버튼이 눌리도록
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  //키 입력 이벤트리스너
  useEffect(() => {
    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [email, password]);

  
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const userId = email.replace(".", "_");
      const dbRef = ref(getDatabase());
      // Check the 'user/0' path
      await get(child(dbRef, `users/${userId}/role`)).then((snapshot) => {
        if (snapshot.exists()) {
          const loggedInUserRole = snapshot.val()
          console.log(loggedInUserRole)
          console.log(userId)
      
          const userData = {id:userId, role:loggedInUserRole}
          setUserData(userData); // Save user data in the store
          alert('로그인 성공');
          console.log(userData)
          handleClickMain(); // Redirect after successful login
        } else {
          alert("유저 권한정보를 db에서 찾지 못했습니다.")
        }
      }).catch((error) => {
        alert('권한 정보 조회 중 에러 : '+ error.code)
      });
    } catch(error) {
      alert('로그인 실패 : ' + error.code);
    }
  };
  const { id, role } = useUserStore();
  console.log(`User ID: ${id}, Role: ${role}`)

  
  
  return (
    <BasicLayout>
      <div className="flex flex-col justify-center items-center min-h-screen py-20">
        <div className="w-full max-w-md p-10 border rounded-lg border-bor">
          <div className="mb-8">
            <label htmlFor="email" className="block text-sm font-medium text-sub">
              이메일
            </label>
            <input
              type="text"
              name="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-textbg text-sub"
            />
          </div>
          <div className="mb-8">
            <label htmlFor="password" className="block text-sm font-medium text-sub">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-textbg text-sub"
            />
          </div>
  
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2 mb-2">
              <button type="button" className="flex-1 py-2 border rounded-md shadow-sm text-sm font-medium text-sub bg-button2 hover:bg-green-700 border-bor focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" 
                onClick={handleLogin}>
                로그인
              </button>
            </div>
            <button type="button" className="flex-1 py-2 border rounded-md shadow-sm text-sm font-medium text-sub bg-button3 hover:bg-hov border-bor focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={handleClickRegister}>
              회원가입
            </button>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
  
}


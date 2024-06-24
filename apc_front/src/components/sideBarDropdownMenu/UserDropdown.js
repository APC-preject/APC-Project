import React, {useCallback} from "react"
import { useNavigate } from "react-router-dom"
import {useAuthStore} from '../../store/AuthStore';
import { useUserStore } from "../../store/UserStore";

export default function UserDropdown() {
  const { user, signOut } = useAuthStore()
  const { clearUserData } = useUserStore()
  const { id } = useUserStore();
  const navigate = useNavigate()

  const handleClickMain = useCallback(() => {
    navigate({pathname:'/'})
  },[navigate])
  const handleClickLogin = useCallback(() => {
    navigate({pathname:'/user/login'})
  },[navigate])
  const handleClickMyPage = useCallback(() => {
    navigate({pathname:'/user/my'})
  },[navigate])

  const handleClickLogout = useCallback(async () => {
    try{
      handleClickMain()
      await signOut()
      await clearUserData()
    } catch(error){
      console.error('Log out error:', error);
    }

  })

  const dropdownstyle = "flex items-center p-1 rounded-lg text-sub hover:bg-hov transition-colors duration-300 cursor-pointer"
  // 로그인 여부에 따른 드롭다운 메뉴 분리
  if (!user || id == null) {
    return (
      <div>
            {/* 드롭다운 메뉴의 내용 */}
            <a className={dropdownstyle} onClick={handleClickLogin}>
              <span className="flex-1 ml-10 whitespace-nowrap">로그인</span>
            </a>
      </div>
    )
  }
  return ( 
    

          <div>
            {/* 드롭다운 메뉴의 내용 */}
            <a className={dropdownstyle} onClick={handleClickMyPage}>
              <span className="flex-1 ml-10 whitespace-nowrap">내정보</span>
            </a>
            <a className={dropdownstyle} onClick={handleClickLogout}>
              <span className="flex-1 ml-10 whitespace-nowrap">로그아웃</span>
            </a>
          </div>    
  )
}

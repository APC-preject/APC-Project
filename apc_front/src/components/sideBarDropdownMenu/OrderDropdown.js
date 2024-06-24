import React, {useCallback} from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/AuthStore"
import { useUserStore } from "../../store/UserStore";


export default function OrderDropdown() {
    const navigate = useNavigate()
    const {user} = useAuthStore();
    const {id, role} = useUserStore(); 

    const handleClickProductRegister = useCallback(() => {
      navigate({pathname:'/product/register'})
    },[navigate])
  
    const handleClickProductList = useCallback(() => {
      navigate({pathname:'/product/list'})
    },[navigate])
    const handleClickOrderedList = useCallback(() => {
      navigate({pathname:'/product/orderedList'})
    },[navigate])
    const handleClickOrderManagement = useCallback(() => {
      navigate({pathname:'/product/order/management'})
    },[navigate])

    const dropdownstyle = "flex items-center p-1  rounded-lg text-sub hover:bg-hov transition-colors duration-300 cursor-pointer"
    

    if (user && id && role == 0) {
      return(
        <div>
        {/* 드롭다운 메뉴의 내용 */}
        <a className={dropdownstyle} onClick={handleClickProductList}>
          <span className="flex-1 ml-10 whitespace-nowrap">상품목록</span>
        </a>
        <a className={dropdownstyle} onClick={handleClickOrderedList}>
          <span className="flex-1 ml-10 whitespace-nowrap">주문내역</span>
        </a>
      </div>
      )
        
    }

    if (user && id && role == 1)
    return (
        <div>
        {/* 드롭다운 메뉴의 내용 */}
        <a className={dropdownstyle} onClick={handleClickProductList}>
          <span className="flex-1 ml-10 whitespace-nowrap">상품목록</span>
        </a>
        <a className={dropdownstyle} onClick={handleClickOrderedList}>
          <span className="flex-1 ml-10 whitespace-nowrap">주문내역</span>
        </a>
        <a className={dropdownstyle} onClick={handleClickProductRegister}>
          <span className="flex-1 ml-10 whitespace-nowrap">상품등록</span>
        </a>
        <a className={dropdownstyle} onClick={handleClickOrderManagement}>
          <span className="flex-1 ml-10 whitespace-nowrap">주문관리</span>
        </a>
        
      </div>
          
    )

    return (
      <div>
        <a className={dropdownstyle} onClick={handleClickProductList}>
          <span className="flex-1 ml-10 whitespace-nowrap">상품목록</span>
        </a>
      </div>
    )
};

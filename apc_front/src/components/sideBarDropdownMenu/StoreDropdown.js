import React, {useCallback} from "react"
import { useNavigate } from "react-router-dom"

export default function StoreDropdown() {
    const navigate = useNavigate()

    const handleClickMain = useCallback(() => {
      navigate({pathname:'/store/coldStorage'})
    },[navigate])
  
  
    const dropdownstyle = "flex items-center p-1  rounded-lg text-sub hover:bg-hov transition-colors duration-300 cursor-pointer"
    return (
      
  
            <div>
              {/* 드롭다운 메뉴의 내용 */}
              <a className={dropdownstyle} onClick={handleClickMain}>
                <span className="flex-1 ml-10 whitespace-nowrap">저장소</span>
              </a>
              
            </div>    
    )
}

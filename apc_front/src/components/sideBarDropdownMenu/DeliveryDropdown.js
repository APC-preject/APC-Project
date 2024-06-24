import React, {useCallback} from "react"
import { useNavigate } from "react-router-dom"

export default function DeliveryDropdown() {
    const navigate = useNavigate()
  
    const handleClickDeliveryList = useCallback(() => {
      navigate({pathname:'/delivery/list'})
    },[navigate])

    const dropdownstyle = "flex items-center p-1  rounded-lg text-sub hover:bg-hov transition-colors duration-300 cursor-pointer"
    return (
        <div>
        {/* 드롭다운 메뉴의 내용 */}
        <a className={dropdownstyle} onClick={handleClickDeliveryList}>
          <span className="flex-1 ml-10 whitespace-nowrap">이력조회</span>
        </a>
      </div>
          
    )
}

import React, {useCallback} from "react"
import { useNavigate } from "react-router-dom"

export default function PurchaseDropdown() {
    const navigate = useNavigate()

    const handleClickMain = useCallback(() => {
      navigate({pathname:'/'})
    },[navigate])
  
    const handleClickReviewableList = useCallback(() => {
      navigate({pathname:'/review/ableList'})
    },[navigate])

    const dropdownstyle = "flex items-center p-1  rounded-lg text-sub hover:bg-hov transition-colors duration-300 cursor-pointer"
    return (
        <div>
        {/* 드롭다운 메뉴의 내용 */}
        <a className={dropdownstyle} onClick={handleClickReviewableList}>
          <span className="flex-1 ml-10 whitespace-nowrap">등록</span>
        </a>
      </div>
          
    )
}

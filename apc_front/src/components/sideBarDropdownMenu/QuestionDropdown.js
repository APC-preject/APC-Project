import React, {useCallback} from "react"
import { useNavigate } from "react-router-dom"

export default function InquiryDropdown() {
    const navigate = useNavigate()

    const handleClickQuestionList = useCallback(() => {
      navigate({pathname:'/customer/question/list'})
    },[navigate])
  
    const handleClickQuestion = useCallback(() => {
      navigate({pathname:'/customer/question'})
    },[navigate])

    const handleClickMyQuestionList = useCallback(() => {
      navigate({pathname:'/customer/question/my/list'})
    },[navigate])

    const dropdownstyle = "flex items-center p-1  rounded-lg text-sub hover:bg-hov transition-colors duration-300 cursor-pointer"
    return (
        <div>
        {/* 드롭다운 메뉴의 내용 */}
        <a className={dropdownstyle} onClick={handleClickQuestion}>
          <span className="flex-1 ml-10 whitespace-nowrap">1:1문의</span>
        </a>
        <a className={dropdownstyle} onClick={handleClickQuestionList}>
          <span className="flex-1 ml-10 whitespace-nowrap">문의내역</span>
        </a>
        <a className={dropdownstyle} onClick={handleClickMyQuestionList}>
          <span className="flex-1 ml-10 whitespace-nowrap">나의문의내역</span>
        </a>
        
      </div>
          
    )
}

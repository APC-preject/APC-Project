import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/AuthStore"
import { useUserStore } from "../../store/UserStore";

export default function InquiryDropdown() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { id, role } = useUserStore();

  const handleClickQuestionList = useCallback(() => {
    navigate({ pathname: '/customer/question/list' })
  }, [navigate])

  const handleClickQuestion = useCallback(() => {
    navigate({ pathname: '/customer/question' })
  }, [navigate])

  const handleClickMyQuestionList = useCallback(() => {
    navigate({ pathname: '/customer/question/my/list' })
  }, [navigate])

  const dropdownstyle = "flex items-center p-1  rounded-lg text-sub hover:bg-hov transition-colors duration-300 cursor-pointer"
  if (user && id && role == 0)
    return (
      <div>
        <a className={dropdownstyle} onClick={handleClickMyQuestionList}>
          <span className="flex-1 ml-10 whitespace-nowrap">나의문의내역</span>
        </a>

      </div>

    )
  if (user && id && role == 1)
    return (
      <div>
        <a className={dropdownstyle} onClick={handleClickQuestionList}>
          <span className="flex-1 ml-10 whitespace-nowrap">나의상품문의내역</span>
        </a>
        <a className={dropdownstyle} onClick={handleClickMyQuestionList}>
          <span className="flex-1 ml-10 whitespace-nowrap">나의문의내역</span>
        </a>

      </div>

    )
}

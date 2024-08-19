import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"

export default function LogisticsDropdown() {
  const navigate = useNavigate()

  const handleClickAnalysis = useCallback(() => {
    navigate({ pathname: "/logisticsData" })
  }, [navigate])

  const handleClickMap = useCallback(() => {
    navigate({ pathname: "/logisticsMap" })
  }, [navigate])

  const dropdownstyle = "flex items-center p-1  rounded-lg text-sub hover:bg-hov transition-colors duration-300 cursor-pointer"
  return (
    <div>
      <a className={dropdownstyle} onClick={handleClickAnalysis}>
        <span className="flex-1 ml-10 whitespace-nowrap">배송 현황</span>
      </a>
      <a className={dropdownstyle} onClick={handleClickMap}>
        <span className="flex-1 ml-10 whitespace-nowrap">물류망 구조</span>
      </a>
    </div>
  )
}

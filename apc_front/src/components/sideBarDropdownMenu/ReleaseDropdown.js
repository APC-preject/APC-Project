import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"

export default function RealeaseDropdown() {
  const navigate = useNavigate()

  const handleClickRelease = useCallback(() => {
    navigate({ pathname: "/registRelease" })
  }, [navigate])
  const handleClickReleaseData = useCallback(() => {
    navigate({ pathname: "/releaseData" })
  }, [navigate])
  const handleClickReserve = useCallback(() => {
    navigate({ pathname: "/reserveRelease" })
  }, [navigate])


  const dropdownstyle = "flex items-center p-1  rounded-lg text-sub hover:bg-hov transition-colors duration-300 cursor-pointer"
  return (
    <div>
      <a className={dropdownstyle} onClick={handleClickRelease}>
        <span className="flex-1 ml-10 whitespace-nowrap">출고 등록</span>
      </a>
      <a className={dropdownstyle} onClick={handleClickReserve}>
        <span className="flex-1 ml-10 whitespace-nowrap">출고 예약</span>
      </a>
      <a className={dropdownstyle} onClick={handleClickReleaseData}>
        <span className="flex-1 ml-10 whitespace-nowrap">출고 현황</span>
      </a>
    </div>
  )
}

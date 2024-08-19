import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"

export default function StoreDropdown() {
  const navigate = useNavigate()

  const handleClickStore = useCallback(() => {
    navigate({ pathname: "/registStore" })
  }, [navigate])

  const handleClickStoreData = useCallback(() => {
    navigate({ pathname: "/storeData" })
  }, [navigate])


  const dropdownstyle = "flex items-center p-1  rounded-lg text-sub hover:bg-hov transition-colors duration-300 cursor-pointer"
  return (
    <div>
      <a className={dropdownstyle} onClick={handleClickStore}>
        <span className="flex-1 ml-10 whitespace-nowrap">입고 등록</span>
      </a>
      <a className={dropdownstyle} onClick={handleClickStoreData}>
        <span className="flex-1 ml-10 whitespace-nowrap">품질 선별</span>
      </a>
    </div>
  )
}

import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"

export default function InfoDropdown() {
    const navigate = useNavigate()

    const handleClickInfo = useCallback(() => {
        navigate({ pathname: '/else/info' })
    }, [navigate])

    const dropdownstyle = "flex items-center p-1  rounded-lg text-sub hover:bg-hov transition-colors duration-300 cursor-pointer"
    return (
        <div>
            <a className={dropdownstyle} onClick={handleClickInfo}>
                <span className="flex-1 ml-10 whitespace-nowrap">사업소개</span>
            </a>
        </div>

    )
}

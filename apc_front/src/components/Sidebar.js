import React, { useState } from 'react';
import UserDropdown from './sideBarDropdownMenu/UserDropdown';
import OrderDropdown from './sideBarDropdownMenu/OrderDropdown';
import DeliveryDropdown from './sideBarDropdownMenu/DeliveryDropdown';
import StoreDropdown from './sideBarDropdownMenu/StoreDropdown';
import QuestionDropdown from './sideBarDropdownMenu/QuestionDropdown';
import InfoDropdown from './sideBarDropdownMenu/InfoDropdown';
import { useAuthStore } from "../store/AuthStore"
import { useUserStore } from "../store/UserStore";

export default function Sidebar() {

    const { user } = useAuthStore();
    const { id, role } = useUserStore();

    if (user && id && role == 0)
        return (
            <aside id="separator-sidebar"
                className="fixed top-0 left-0 z-40 w-1/6 h-screen pt-20 transition-transform bg-main border border-bor"
                aria-label="Sidebar">
                <div className="h-4/5 px-3 pb-4 overflow-y-auto bg-mist">
                    <ul className="space-y-1">
                        <li>
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg aria-hidden="true"
                                    className="flex-shrink-0 w-6 h-6 text-baritem transition duration-75 dark:text-gray-400 group-hover:text-sub dark:group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd">
                                    </path>
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">계정</span>
                            </div>
                            <UserDropdown />
                        </li>
                    </ul>

                    <ul className="pt-2 mt-2 space-y-1 font-medium border-t border-bor">

                        <li>
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg
                                    className="flex-shrink-0 w-6 h-6  transition duration-75 text-baritem group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path
                                        d='M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a65.25 65.25 0 0113.36 1.412.75.75 0 01.58.875 48.645 48.645 0 01-1.618 6.2.75.75 0 01-.712.513H6a2.503 2.503 0 00-2.292 1.5H17.25a.75.75 0 010 1.5H2.76a.75.75 0 01-.748-.807 4.002 4.002 0 012.716-3.486L3.626 2.716a.25.25 0 00-.248-.216H1.75A.75.75 0 011 1.75zM6 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'>
                                    </path>
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">주문</span>
                            </div>
                            <OrderDropdown />
                        </li>

                        <li>
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg
                                    className="flex-shrink-0 w-6 h-6  transition duration-75 text-baritem group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path
                                        d="M15.5 10.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm0 0a2.225 2.225 0 0 0-1.666.75H12m3.5-.75a2.225 2.225 0 0 1 1.666.75H19V7m-7 4V3h5l2 4m-7 4H6.166a2.225 2.225 0 0 0-1.666-.75M12 11V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v9h1.834a2.225 2.225 0 0 1 1.666-.75M19 7h-6m-8.5 3.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">배송</span>
                            </div>
                            <DeliveryDropdown />

                        </li>

                        <li>
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg
                                    className="flex-shrink-0 w-6 h-6  transition duration-75 text-baritem group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clipRule="evenodd" fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z">
                                    </path>
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">상품문의</span>
                            </div>
                            <QuestionDropdown />
                        </li>

                        <li>
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg
                                    className="flex-shrink-0 w-6 h-6  transition duration-75 text-baritem group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clipRule="evenodd" fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z">
                                    </path>
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">고객문의</span>
                            </div>
                            <QuestionDropdown />
                        </li>

                        <li>
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg
                                    className="flex-shrink-0 w-6 h-6  transition duration-75 text-baritem group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clipRule="evenodd" fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z">
                                    </path>
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">기타정보</span>
                            </div>
                            <InfoDropdown />
                        </li>
                    </ul>
                </div>

                <hr></hr>
            </aside>
        )
    else
        return (
            <aside id="separator-sidebar"
                className="fixed top-0 left-0 z-40 w-1/6 h-screen pt-20 transition-transform bg-main border border-bor"
                aria-label="Sidebar">
                <div className="h-4/5 px-3 pb-4 overflow-y-auto bg-mist">
                    <ul className="space-y-1">
                        <li>
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg aria-hidden="true"
                                    className="flex-shrink-0 w-6 h-6 text-baritem transition duration-75 dark:text-gray-400 group-hover:text-sub dark:group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd">
                                    </path>
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">계정</span>
                            </div>
                            <UserDropdown />
                        </li>
                    </ul>

                    <ul className="pt-2 mt-2 space-y-1 font-medium border-t border-bor">

                        <li>
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg
                                    className="flex-shrink-0 w-6 h-6  transition duration-75 text-baritem group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path
                                        d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z">
                                    </path>
                                    <path
                                        d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z">

                                    </path>
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">입고</span>
                            </div>
                            <StoreDropdown />
                        </li>


                        <li>
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg
                                    className="flex-shrink-0 w-6 h-6  transition duration-75 text-baritem group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path
                                        d='M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a65.25 65.25 0 0113.36 1.412.75.75 0 01.58.875 48.645 48.645 0 01-1.618 6.2.75.75 0 01-.712.513H6a2.503 2.503 0 00-2.292 1.5H17.25a.75.75 0 010 1.5H2.76a.75.75 0 01-.748-.807 4.002 4.002 0 012.716-3.486L3.626 2.716a.25.25 0 00-.248-.216H1.75A.75.75 0 011 1.75zM6 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'>

                                    </path>
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">주문</span>
                            </div>
                            <OrderDropdown />
                        </li>

                        <li>
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg
                                    className="flex-shrink-0 w-6 h-6  transition duration-75 text-baritem group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path
                                        d="M15.5 10.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm0 0a2.225 2.225 0 0 0-1.666.75H12m3.5-.75a2.225 2.225 0 0 1 1.666.75H19V7m-7 4V3h5l2 4m-7 4H6.166a2.225 2.225 0 0 0-1.666-.75M12 11V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v9h1.834a2.225 2.225 0 0 1 1.666-.75M19 7h-6m-8.5 3.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">배송</span>
                            </div>
                            <DeliveryDropdown />

                        </li>

                        <li>
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg
                                    className="flex-shrink-0 w-6 h-6  transition duration-75 text-baritem group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clipRule="evenodd" fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z">
                                    </path>
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">상품문의</span>
                            </div>
                            <QuestionDropdown />
                        </li>

                        <li>
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg
                                    className="flex-shrink-0 w-6 h-6  transition duration-75 text-baritem group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clipRule="evenodd" fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z">
                                    </path>
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">고객문의</span>
                            </div>
                            <QuestionDropdown />
                        </li>
                        <li>
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg
                                    className="flex-shrink-0 w-6 h-6  transition duration-75 text-baritem group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clipRule="evenodd" fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z">
                                    </path>
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">기타정보</span>
                            </div>
                            <InfoDropdown />
                        </li>
                    </ul>
                </div>

                <hr></hr>
                <div className='flex-col px-3 pb-4 overflow-hidden bg-mist items-center p-2 text-base font-normal rounded-lg text-sub'>
                    <div className='text-base mb-5'>
                        박찬영: tmakdrl@naver.com<br></br>
                        함동균: dh4m28@gmail.com
                    </div>
                    <a href="https://github.com/APC-preject/APC-backend">
                        <div className='flex text-4xl text-sub text-bold items-center'>
                            <svg
                                role="img"
                                width="50"
                                height="50"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ filter: 'invert(1)' }}
                            >
                                <title>GitHub</title>
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                            </svg>
                            <span className='m-2'>GitHub</span>
                        </div>
                    </a>
                </div>
            </aside>
        )
}

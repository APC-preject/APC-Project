import React, { useState } from 'react';
import StoreDropdown from './sideBarDropdownMenu/StoreDropdown';
import StockDropdown from './sideBarDropdownMenu/StockDropdown';
import InfoDropdown from './sideBarDropdownMenu/InfoDropdown';
import { useAuthStore } from "../store/AuthStore"
import { useUserStore } from "../store/UserStore";
import RealeaseDropdown from './sideBarDropdownMenu/ReleaseDropdown';
import LogisticsDropdown from './sideBarDropdownMenu/LogisticsDropdown';

export default function Sidebar() {

  const { user } = useAuthStore();
  const { id, role } = useUserStore();

  return (
    <aside id="separator-sidebar"
      className="fixed top-0 left-0 z-40 w-1/6 h-screen pt-20 transition-transform bg-main border border-bor"
      aria-label="Sidebar">
      <div className="h-4/5 px-3 pb-4 overflow-y-auto bg-mist">
        <ul className="space-y-1">
          <li>
            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">관리자 페이지</span>
            </div>
            {/* <UserDropdown /> */}
          </li>
        </ul>
        <ul className="pt-2 mt-2 space-y-1 font-medium border-t border-bor">
          <li>
            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
              </svg>

              <span className="flex-1 ml-3 whitespace-nowrap">입고 관리</span>
            </div>
            <StoreDropdown />
          </li>
          <li>
            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
              </svg>

              <span className="flex-1 ml-3 whitespace-nowrap">저장 관리</span>
            </div>
            <StockDropdown />
          </li>
          <li>
            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">출고 관리</span>
            </div>
            <RealeaseDropdown />
          </li>
          <li>
            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">배송 관리</span>
            </div>
            <LogisticsDropdown />
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
  );
}

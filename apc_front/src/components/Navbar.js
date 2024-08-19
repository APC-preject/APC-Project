import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Dropdown = ({ isVisible, onClose, targetRef, items }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 드롭다운 외부 클릭 감지를 위한 이벤트 리스너 등록
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !targetRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, targetRef]);


  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute bg-gray rounded-lg shadow-lg p-4 mt-2"
      style={{
        top: targetRef.current ? targetRef.current.getBoundingClientRect().bottom + window.scrollY : 0,
        left: targetRef.current ? targetRef.current.getBoundingClientRect().left + window.scrollX : 0,
      }}
    >
      {items.slice(0, 9).map((item, index) => (
        <p key={index} className="mb-2 bg-gray-200 text-black p-2 rounded-lg hover:bg-hov2 transition-colors duration-300 cursor-pointer"
        onClick={() => navigate('/reserveRelease')}>
          <span className='text-bold'>{`${item.company}`}</span> 에서 새로운 예약이 있습니다.
        </p>
      ))}
      <div className='mb-2 flex transition-colors cursor-pointer' onClick={() => navigate('/reserveRelease')}>
        <span className='ml-auto'>{items.length >= 10 && `외 ${items.length - 9}개의 예약`}</span>
        </div>
    </div>
  );
};

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [alertData, setAlertData] = useState([]); // 알림 데이터가 담긴 배열

  const buttonRef = useRef(null);

  useEffect(() => {
    const pageLoading = async () => {
      try {
        const response = await fetch(`/api/stock/reserveList`, {
          method: 'GET',
        })
        if (!response.ok) {
          throw new Error('network response Error');
        }
        const data = await response.json();
        setAlertData(
          Object.entries(data)
            .reverse()
            .map(([k, v]) => ({ id: k, company: v.customer, accept: v.accept }))
            .filter(e => e.accept == 0)
        )
      } catch (error) {
        console.log(error);
      }
    };
    pageLoading();
  }, []);

  const handleOpenModal = () => {
    setShowModal(!showModal);
  };
  

  return (
    <div>
      <nav className=" fixed top-0 h-1/10 z-50 w-full bg-main border border-bor">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <Link to={'/'} className='flex ml-2 md:mr-24'>
                <img src={process.env.PUBLIC_URL + '/assets/rda_logo.png'} className="h-8 mr-3" alt="Logo" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-sub">
                  APC</span>
              </Link>
            </div>
            <div className='ml-auto flex text-sub'>
              {alertData.length === 0 ? (
                <div className='flex text-base text-gray'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 mx-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                  </svg>
                  현재 새로운 예약이 없습니다
                </div>
              ) : (
                <div ref={buttonRef} className='flex text-base text-sub text-bold rounded-lg hover:bg-hov transition-colors duration-300 focus:outline-none focus:shadow-outline cursor-pointer' onClick={handleOpenModal}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FF6666" className="size-6 mx-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                  </svg>
                  {`${alertData.length}개의 새로운 예약 알림이 있습니다`}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" width="100" height="100" className="size-6 mx-1">
                    <circle cx="50" cy="50" r="40" fill="red" />
                    <text x="50" y="50" fill="white" fontSize="40" textAnchor="middle" alignmentBaseline="middle">{`${alertData.length}`}</text>
                  </svg>
                </div>
              )
              }
              <Dropdown
                isVisible={showModal}
                onClose={() => setShowModal(false)}
                targetRef={buttonRef}
                items={alertData}
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

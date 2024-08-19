import React, { useState, useRef, useEffect } from 'react';
import GridCell from './LocationGridCell';
import LogisticsProgress from "./logisticsProgress";

const LogisticsDetailModal = ({ onClose, details, id }) => {
  const modalRef = useRef(null);

  // 모달 외부 클릭 감지를 위한 이벤트 리스너 등록
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, modalRef]);

  const clickClose = async () => {
    if (details.length === 9)
      onClose();
    try {
      const response = await fetch(`/api/logistics/${id}`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('network response Error');
      }
    } catch (error) {
      console.log(error);
    }
    onClose();
  } 

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto min-w-full">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 opacity-75"></div>
        </div>
        <div ref={modalRef} className="relative bg-sub border border-bor rounded-lg p-8 mx-auto">
          <div className='flex font-bold mb-4 text-black border-b'>
            <h1 className="text-2xl font-bold text-black">배송 상세 정보</h1>
          </div>
          <div className='flex items-center justify-center text-lg'>
            <LogisticsProgress currentStage={details.length - 1}/>
          </div>
          <table className="min-w-full table-auto border-collapse mb-3">
            <thead>
              <tr className="bg-baritem text-main">
                <th className="px-4 py-2 border-b border-bor text-lg">차량</th>
                <th className="px-4 py-2 border-b border-bor text-lg">위치</th>
                <th className="px-4 py-2 border-b border-bor text-lg">상태</th>
                <th className="px-4 py-2 border-b border-bor text-lg">시각</th>
                <th className="px-4 py-2 border-b border-bor text-lg">온도</th>
                <th className="px-4 py-2 border-b border-bor text-lg">습도</th>
                <th className="px-4 py-2 border-b border-bor text-lg">에틸렌</th>
              </tr>
            </thead>
            <tbody>
              {details.slice(1).map((detailItems, i) => (
                <tr
                  key={i}
                >
                  <td className="border-b border-bor px-4 py-2 text-black text-center text-lg">
                    {detailItems ? detailItems.truck : '-'}
                  </td>
                  <td className="border-b border-bor px-4 py-2 text-black text-center text-lg">
                    {detailItems ? detailItems.location : '-'}
                  </td>
                  <td className="border-b border-bor px-4 py-2 text-black text-center text-lg">
                    {detailItems ? detailItems.state : '-'}
                  </td>
                  <td className="border-b border-bor px-4 py-2 text-black text-center text-lg">
                    {detailItems ? detailItems.time : '-'}
                  </td>
                  <td className="border-b border-bor px-4 py-2 text-black text-center text-lg">
                    {detailItems ? detailItems.environment.temp.toFixed(2) : '-'}도
                  </td>
                  <td className="border-b border-bor px-4 py-2 text-black text-center text-lg">
                    {detailItems ? detailItems.environment.humidity.toFixed(2) : '-'}%
                  </td>
                  <td className="border-b border-bor px-4 py-2 text-black text-center text-lg">
                    {detailItems ? detailItems.environment.ethylene.toFixed(2) : '-'}ppm
                  </td>
                </tr>
              )).reverse()}
            </tbody>
          </table>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-button text-white rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
              onClick={clickClose}
              type='button'
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogisticsDetailModal;

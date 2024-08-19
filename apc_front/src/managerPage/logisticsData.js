import React, { useState, useEffect, useCallback, useRef } from 'react';
import BasicLayout from '../layout/BasicLayout';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogisticsDetailModal from './LogisticsDetailModal';


export default function MainPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [logisticList, setLogisticList] = useState([]);
  const [logisticDetail, setLogisticDetail] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailViewItem, setDetailViewItem] = useState({});

  useEffect(() => {
    const pageLoading = async () => {
      try {
        const response = await fetch(`/api/release`, {
          method: 'GET',
        })
        if (!response.ok) {
          throw new Error('network response Error');
        }
        const data = await response.json();
        setLogisticList(
          Object.entries(data)
            .map(([k, v]) => ({
              id: k, ...v
            })).reverse()
        );
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    pageLoading();
  }, []);

  const timeSetting = { // 현재 시간 생성
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,    // 24시간 형식 사용
    timeZone: 'Asia/Seoul'    // 한국 표준시 (KST)
  };

  async function handleDetailView(item) {
    setDetailViewItem(item);
    setIsModalOpen(true);
  }

  return (
    <BasicLayout>
      <div className="container mx-auto px-4 py-20">
        <div className='flex font-bold mb-4 text-sub border-b'>
          <h1 className="text-2xl font-bold text-sub">배송 현황</h1>
          {/* <div className='flex ml-auto'>
            여기에 검색?
          </div> */}
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div id="loading-spinner" className="flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) :
            logisticList.length > 0 ? (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-baritem text-main">
                    <th className="px-4 py-2 border-b border-bor text-lg">출고 ID</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">현재 차량</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">현재 위치</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">현재 상태</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">상태 변경 시각</th>
                  </tr>
                </thead>
                <tbody>
                  {logisticList.map((logisticsItem) => (
                    <tr
                      key={logisticsItem.id}
                      className="hover:bg-hov transition-colors duration-300"
                      onClick={() => handleDetailView(logisticsItem)}
                    >
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {logisticsItem.id ? logisticsItem.id : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {logisticsItem.LogisticsInfo[logisticsItem.LogisticsInfo.length - 1] ? logisticsItem.LogisticsInfo[logisticsItem.LogisticsInfo.length - 1].truck : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {logisticsItem.LogisticsInfo[logisticsItem.LogisticsInfo.length - 1] ? logisticsItem.LogisticsInfo[logisticsItem.LogisticsInfo.length - 1].location : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {logisticsItem.LogisticsInfo[logisticsItem.LogisticsInfo.length - 1] ? logisticsItem.LogisticsInfo[logisticsItem.LogisticsInfo.length - 1].state : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {logisticsItem.LogisticsInfo[logisticsItem.LogisticsInfo.length - 1] ? logisticsItem.LogisticsInfo[logisticsItem.LogisticsInfo.length - 1].time : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-lg text-sub mt-8">배송기록이 없습니다.</p>
            )}
          {isModalOpen &&
            <LogisticsDetailModal
              onClose={() => { setIsModalOpen(false) }}
              details={detailViewItem.LogisticsInfo}
              id={detailViewItem.id} />
          }
        </div>
      </div>
    </BasicLayout>
  )
}
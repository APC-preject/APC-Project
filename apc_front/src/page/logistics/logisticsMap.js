import React, { useState, useEffect, useCallback, useRef } from 'react';
import BasicLayout from '../../layout/BasicLayout';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogisticsDetailModal from '../../modal/LogisticsDetailModal';


export default function MainPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [logisticList, setLogisticList] = useState([]);
  const [logisticDetail, setLogisticDetail] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailViewItem, setDetailViewItem] = useState({});

  useEffect(() => {
    const pageLoading = async () => {

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

  return (
    <BasicLayout>
      <div className="container mx-auto px-4 py-20">
        <div className='flex font-bold mb-4 text-sub border-b'>
          <h1 className="text-2xl font-bold text-sub">물류망 구조</h1>
        </div>
        <div className="overflow-x-auto text-sub">
          <div className='flex bg-cover bg-center mt-5'>
            <img src='/assets/logisticsmap.png' style={{ width: '90%' }}></img>
          </div>
        </div>
      </div>
    </BasicLayout>
  )
}
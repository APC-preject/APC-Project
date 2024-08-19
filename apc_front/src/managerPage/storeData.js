import React, { useState, useEffect, useCallback, useRef } from 'react';
import BasicLayout from '../layout/BasicLayout';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SelectModal from './SelectModal';

export default function MainPage() {
  const fruitCategory = ['토마토', '사과', '파프리카', '포도', '참다래', '딸기'];

  const [isLoading, setIsLoading] = useState(true);
  const [storeList, setStoreList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailViewItem, setDetailViewItem] = useState({});
  const [detailViewIndex, setDetailViewIndex] = useState(0);

  const [category, setCategory] = useState(fruitCategory.reduce((acc, cur) => {
    acc[cur] = true;
    return acc;
  }, {}));

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/store`, {
        method: 'GET',
      })
      if (!response.ok) {
        throw new Error('network response Error');
      }
      const data = await response.json();
      const list = Object.entries(data)
        .reverse()
        .map(([k, v]) => ({ id: k, ...v }));
      setStoreList(list)
      setDetailViewItem(list[detailViewIndex]);
      console.log("data fetched");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const pageLoading = async () => {
      await fetchData();

      setIsLoading(false);
    };
    pageLoading();

    const intervalId = setInterval(fetchData, 3000);

    return () => clearInterval(intervalId);
  }, []);

  async function clickClassification(id) {
    try {
      let response = await fetch(`/api/store/class/${id}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('network error');
      }

      response = await fetch(`/api/store`, {
        method: 'GET',
      })
      if (!response.ok) {
        throw new Error('network response Error');
      }
      const data = await response.json();
      setStoreList(
        Object.entries(data)
          .reverse()
          .map(([k, v]) => ({ id: k, ...v }))
      )
      setDetailViewItem(storeList[detailViewIndex]);
    } catch (error) {
      console.log(error);
    }
  }

  const handleCategoryChange = async (c) => {
    const newCategory = { ...category, [c]: !category[c] };
    setCategory(newCategory);
  }

  async function handleDetailView(item, i) {
    setDetailViewItem(item);
    setDetailViewIndex(i);
    setIsModalOpen(true);
  }

  return (
    <BasicLayout>
      <div className="container mx-auto px-4 py-20">
        <div className='flex font-bold mb-4 text-sub border-b'>
          <h1 className="text-2xl font-bold mb-1 text-sub">품질 선별</h1>
          <div className='flex ml-auto'>
            {fruitCategory.map((option) => (
              <button
                key={option}
                onClick={() => handleCategoryChange(option)}
                type="button"
                className={`transition-colors duration-300 text-white px-3 rounded mx-3 mb-1 ${!category[option] ? 'bg-button3' : 'bg-button2'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div id="loading-spinner" className="flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) :
            storeList.length > 0 ? (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-baritem text-main">
                    <th className="px-4 py-2 border-b border-bor text-lg">재배자</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">품목</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">입고일자</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">1</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">2</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">3</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">4</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">5</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">6</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">7</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">선별 여부</th>
                  </tr>
                </thead>
                <tbody>
                  {storeList.filter(e => category[e.name]).map((storeItem, i) => (
                    <tr
                      key={storeItem.id}
                      className="hover:bg-hov transition-colors duration-300"
                      onClick={() => handleDetailView(storeItem, i)}
                    >
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {storeItem.productor || '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {storeItem.name || '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {storeItem.date || '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {storeItem.class_complete && storeItem.quantity[1] ? storeItem.quantity[1] : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {storeItem.class_complete && storeItem.quantity[2] ? storeItem.quantity[2] : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {storeItem.class_complete && storeItem.quantity[3] ? storeItem.quantity[3] : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {storeItem.class_complete && storeItem.quantity[4] ? storeItem.quantity[4] : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {storeItem.class_complete && storeItem.quantity[5] ? storeItem.quantity[5] : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {storeItem.class_complete && storeItem.quantity[6] ? storeItem.quantity[6] : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {storeItem.class_complete && storeItem.quantity[7] ? storeItem.quantity[7] : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {storeItem.class_complete ? `선별 완료` :
                          storeItem.classification ? `선별 중..` :
                            storeItem.generation ? (
                              <>
                                <span className='px-5'>미선별</span>
                                <button
                                  onClick={() => clickClassification(storeItem.id)}
                                  className={`transition-colors duration-300 text-white py-2 px-4 rounded bg-button hover:bg-button2Hov`}
                                >
                                  선별하기
                                </button>
                              </>
                            ) : `입고 중..`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-lg text-sub mt-8">입고 내역이 없습니다.</p>
            )}
          {isModalOpen &&
            <SelectModal
              onClose={() => { setIsModalOpen(false) }}
              state={detailViewItem.class_complete ? 3 : detailViewItem.classification ? 2 : detailViewItem.generation ? 1 : 0}
              grade={detailViewItem.quantity}
              id={detailViewItem.id}
              total={detailViewItem.total}
              classFunc={clickClassification}
              gradeSet={[1, 2, 3, 4, 5, 6, 7]} />
          }
        </div>
      </div>
    </BasicLayout>
  )
}

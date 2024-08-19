import React, { useState, useEffect, useCallback, useRef } from 'react';
import BasicLayout from '../layout/BasicLayout';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LocationModal from './LocationModal';



export default function MainPage() {
  const fruitCategory = ['토마토', '사과', '파프리카', '포도', '참다래', '딸기'];

  const [isLoading, setIsLoading] = useState(true);
  const [stockTimeList, setStockTimeList] = useState([]);
  const [grade, setGrade] = useState({ [1]: true, [2]: true, [3]: true, [4]: true, [5]: true, [6]: true, [7]: true });
  const [isModalOpen, setModalOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [selectKey, setSelectKey] = useState(0);

  const [category, setCategory] = useState(fruitCategory.reduce((acc, cur) => {
    acc[cur] = true;
    return acc;
  }, {}));
  const [expireSort, setExpireSort] = useState(false);


  const fetchData = async () => {
    try {
      const response = await fetch(`/api/stock/timestamp`, {
        method: 'GET',
      })
      if (!response.ok) {
        throw new Error('network response Error');
      }
      const data = await response.json();
      setStockTimeList(
        Object.entries(data)
          .map(([k, v]) => ({
            input: parseInt(k),
            expired: parseInt(k) + 7 * 24 * 3600 * 1000,
            leaveTime: (parseInt(k) + 7 * 24 * 3600 * 1000 - new Date().getTime()) / (60 * 1000),
            ...v
          })).sort((a, b) => {
            return a.expired - b.expired;
          })
      )
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
  }, []);

  const handleGradeChange = async (g) => {
    const newGrade = { ...grade, [g]: !grade[g] };
    setGrade(newGrade);
  }

  const handleCategoryChange = async (c) => {
    const newCategory = { ...category, [c]: !category[c] };
    setCategory(newCategory);
  }

  const timeSetting = { // 현재 시간 생성
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,    // 24시간 형식 사용
    timeZone: 'Asia/Seoul'    // 한국 표준시 (KST)
  };

  const handleOpenModal = (k) => {
    setModalOpen(true);
    setSelectKey(k);
  };

  const handleCloseModal = async (data) => {
    setLocation(data);
    setModalOpen(false);
    if (data) {
      console.log(data);
      try {
        const response = await fetch(`/api/stock/timestamp/${selectKey}`, {
          method: 'PUT',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json' // Content-Type 헤더 추가
          },
        })
        if (!response.ok) {
          throw new Error('network response Error');
        }
        await fetchData();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const ProductRank = ['1', '2', '3', '4', '5', '6', '7'];

  return (
    <BasicLayout>
      <div className="container mx-auto px-4 py-20">
        <div className='flex font-bold mb-4 text-sub border-b'>
          <h1 className="text-2xl font-bold text-sub">재고 현황</h1>
          <button
            onClick={() => setExpireSort(!expireSort)}
            type="button"
            className={`transition-colors duration-300 text-white px-5 rounded mx-3 mb-5 bg-button2`}
          >
            {expireSort ? '유통기한순 정렬' : '입고순 정렬' }
          </button>
          <div className='flex-col ml-auto'>
            <div className='flex ml-auto'>
              {fruitCategory.map((option) => (
                <button
                  key={option}
                  onClick={() => handleCategoryChange(option)}
                  type="button"
                  className={`transition-colors duration-300 text-white px-5 rounded mx-1 mb-1 ${!category[option] ? 'bg-button3' : 'bg-button2'}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className='flex ml-auto'>
              {ProductRank.map((option) => (
                <button
                  key={option}
                  onClick={() => handleGradeChange(option)}
                  type="button"
                  className={`transition-colors duration-300 text-white px-5 rounded mx-3 mb-1 ${!grade[option] ? 'bg-button3' : 'bg-button2'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div id="loading-spinner" className="flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) :
            stockTimeList.length > 0 ? (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-baritem text-main">
                    <th className="px-4 py-2 border-b border-bor text-lg">품목</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">입고일자</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">유통기한</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">남은 일자</th>
                    {ProductRank.filter(e => grade[e]).map((option) => (
                      <th className="px-4 py-2 border-b border-bor text-lg">{option}</th>
                    ))}
                    <th className="px-4 py-2 border-b border-bor text-lg">저장 위치</th>
                  </tr>
                </thead>
                <tbody>
                  {stockTimeList.sort((a, b) => {
                    return expireSort ? a.input - b.input : b.expired - a.expired;
                  }).filter((e) => {
                    for (const k in grade) {
                      if ((grade[k] && e[k]) && category[e.name])
                        return true;
                    }
                    return false;
                  }).map((stockItem) => (
                    <tr
                      key={stockItem.input}
                      className="hover:bg-hov transition-colors duration-300"
                    >
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {stockItem.name || '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {stockItem.input ? new Date(stockItem.input).toLocaleString('ko-KR', timeSetting) : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {stockItem.expired ? new Date(stockItem.expired).toLocaleString('ko-KR', timeSetting) : '-'}
                      </td>
                      {stockItem.leaveTime >= 0 ? (
                        <td className={"border-b border-bor px-4 py-2 text-center text-lg " + (stockItem.leaveTime < 60 * 24 ? 'text-red-300' : 'text-sub')}>
                          {`${Math.floor(stockItem.leaveTime / (60 * 24))}일 `
                            + `${Math.floor((stockItem.leaveTime % (60 * 24)) / 60)}시간 `
                            + `${Math.floor((stockItem.leaveTime % (60 * 24)) % 60)}분 남음`}
                        </td>
                      ) : (
                        <td className={"border-b border-bor px-4 py-2 text-center text-lg text-red-700"}>
                          {`유통기한 경과, 폐기요망`}
                        </td>
                      )}
                      {ProductRank.filter(e => grade[e]).map((option) => (
                        <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                          {stockItem[option] || '-'}
                        </td>
                      ))}
                      {stockItem.place ? (
                        <td className={"border-b border-bor px-4 py-2 text-center text-lg text-sub"}>
                          {`${stockItem.place.x}행 ${stockItem.place.y}열`}
                        </td>
                      ) : (
                        <div className="border-b border-bor px-4 py-2 text-center text-lg">
                          <button
                            className="bg-button hover:bg-button2Hov transition-colors duration-300 text-white px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() => handleOpenModal(stockItem.input)}
                          >
                            위치 선택
                          </button>
                          {isModalOpen && <LocationModal onClose={handleCloseModal} />}
                        </div>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-lg text-sub mt-8">재고가 없습니다.</p>
            )}
        </div>
      </div>
    </BasicLayout>
  )
}
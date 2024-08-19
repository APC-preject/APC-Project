import React, { useState, useEffect, useCallback, useRef } from 'react';
import BasicLayout from '../layout/BasicLayout';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function MainPage() {
  const fruitCategory = ['토마토', '사과', '파프리카', '포도', '참다래', '딸기'];

  const [isLoading, setIsLoading] = useState(true);
  const [releaseList, setReleaseList] = useState([]);
  const [category, setCategory] = useState(fruitCategory.reduce((acc, cur) => {
    acc[cur] = true;
    return acc;
  }, {}));

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
        setReleaseList(
          Object.entries(data)
            .reverse()
            .map(([k, v]) => ({ id: k, ...v }))
        )
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
    };
    pageLoading();
  }, []);

  const handleCategoryChange = async (c) => {
    const newCategory = { ...category, [c]: !category[c] };
    setCategory(newCategory);
  }


  return (
    <BasicLayout>
      <div className="container mx-auto px-4 py-20">
        <div className='flex font-bold mb-4 text-sub border-b'>
          <h1 className="text-2xl font-bold text-sub">출고 현황</h1>
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
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div id="loading-spinner" className="flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) :
            releaseList.length > 0 ? (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-baritem text-main">
                    <th className="px-4 py-2 border-b border-bor text-lg">품목</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">출고일자</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">1</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">2</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">3</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">4</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">5</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">6</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">7</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">출고 위치</th>
                  </tr>
                </thead>
                <tbody>
                  {releaseList.filter(e => category[e.name]).map((releaseItem) => (
                    <tr
                      key={releaseItem.id}
                      className="hover:bg-hov transition-colors duration-300"
                    >
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {releaseItem.name || '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {releaseItem.date || '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {releaseItem.quantity[1] ? releaseItem.quantity[1] : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {releaseItem.quantity[2] ? releaseItem.quantity[2] : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {releaseItem.quantity[3] ? releaseItem.quantity[3] : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {releaseItem.quantity[4] ? releaseItem.quantity[4] : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {releaseItem.quantity[5] ? releaseItem.quantity[5] : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {releaseItem.quantity[6] ? releaseItem.quantity[6] : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {releaseItem.quantity[7] ? releaseItem.quantity[7] : '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {`${releaseItem.loc.x}열 ${releaseItem.loc.y}번`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-lg text-sub mt-8">출고 내역이 없습니다.</p>
            )}
        </div>
      </div>
    </BasicLayout>
  )
}
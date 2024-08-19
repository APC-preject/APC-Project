import React, { useState, useEffect, useCallback, useRef } from 'react';
import BasicLayout from '../layout/BasicLayout';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function MainPage() {
  const [reserveList, setReserveList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptTotal, setAcceptTotal] = useState({
    [1]: 0, [2]: 0, [3]: 0, [4]: 0, [5]: 0, [6]: 0, [7]: 0
  })
  const [waitTotal, setwaitTotal] = useState({
    [1]: 0, [2]: 0, [3]: 0, [4]: 0, [5]: 0, [6]: 0, [7]: 0
  })
  const navigate = useNavigate();

  function convertDate(str) {
    const datePattern = /(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\./;
    const timePattern = /(오전|오후)\s*(\d{1,2}):(\d{2})/;
    const dateMatch = str.match(datePattern);
    const timeMatch = str.match(timePattern);

    if (dateMatch && timeMatch) {
      const year = parseInt(dateMatch[1], 10);
      const month = parseInt(dateMatch[2], 10) - 1; // 월은 0부터 시작
      const day = parseInt(dateMatch[3], 10);
      let hours = parseInt(timeMatch[2], 10);
      const minutes = parseInt(timeMatch[3], 10);
      const period = timeMatch[1];

      // 오후일 경우 시간에 12를 더함 (단, 12시는 그대로 둠)
      if (period === "오후" && hours !== 12) {
        hours += 12;
      }
      // 오전 12시는 자정이므로 0으로 설정
      if (period === "오전" && hours === 12) {
        hours = 0;
      }
      return new Date(year, month, day, hours, minutes).getTime();
    }
    return 0;
  }

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
        let wt = { [1]: 0, [2]: 0, [3]: 0, [4]: 0, [5]: 0, [6]: 0, [7]: 0 };
        let at = { [1]: 0, [2]: 0, [3]: 0, [4]: 0, [5]: 0, [6]: 0, [7]: 0 };
        const newReserve = Object.entries(data)
          .reverse()
          .map(([k, v]) => {
            if (v.accept === 0) {
              wt[1] += parseInt(v[1] || 0);
              wt[2] += parseInt(v[2] || 0);
              wt[3] += parseInt(v[3] || 0);
              wt[4] += parseInt(v[4] || 0);
              wt[5] += parseInt(v[5] || 0);
              wt[6] += parseInt(v[6] || 0);
              wt[7] += parseInt(v[7] || 0);
            }
            if (v.accept === 1) {
              at[1] += parseInt(v[1] || 0);
              at[2] += parseInt(v[2] || 0);
              at[3] += parseInt(v[3] || 0);
              at[4] += parseInt(v[4] || 0);
              at[5] += parseInt(v[5] || 0);
              at[6] += parseInt(v[6] || 0);
              at[7] += parseInt(v[7] || 0);
            }
            setAcceptTotal(at);
            setwaitTotal(wt);
            return { id: k, ...v };
          });
        setReserveList([
          ...newReserve.filter(e => e.accept == 1).sort((a, b) => { return convertDate(a.date) - convertDate(b.date) }),
          ...newReserve.filter(e => e.accept == 0)
        ])
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    pageLoading();
  }, []);

  async function handleReserveAccept(reserveId) {
    try {
      const response = await fetch(`/api/stock/reserveList/accept/${reserveId}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Network response error!');
      }
      const idx = reserveList.findIndex(e => e.id === reserveId);
      const newList = [...reserveList]
      newList[idx].accept = 1;
      setReserveList([
        ...newList.filter(e => e.accept == 1).sort((a, b) => { return convertDate(a.date) - convertDate(b.date) }),
        ...newList.filter(e => e.accept == 0)
      ]);
      const newAcceptTotal = {
        [1]: parseInt(acceptTotal[1] || 0) + parseInt(newList[idx][1] || 0),
        [2]: parseInt(acceptTotal[2] || 0) + parseInt(newList[idx][2] || 0),
        [3]: parseInt(acceptTotal[3] || 0) + parseInt(newList[idx][3] || 0),
        [4]: parseInt(acceptTotal[4] || 0) + parseInt(newList[idx][4] || 0),
        [5]: parseInt(acceptTotal[5] || 0) + parseInt(newList[idx][5] || 0),
        [6]: parseInt(acceptTotal[6] || 0) + parseInt(newList[idx][6] || 0),
        [7]: parseInt(acceptTotal[7] || 0) + parseInt(newList[idx][7] || 0),
      }
      const newWaitTotal = {
        [1]: parseInt(waitTotal[1] || 0) - parseInt(newList[idx][1] || 0),
        [2]: parseInt(waitTotal[2] || 0) - parseInt(newList[idx][2] || 0),
        [3]: parseInt(waitTotal[3] || 0) - parseInt(newList[idx][3] || 0),
        [4]: parseInt(waitTotal[4] || 0) - parseInt(newList[idx][4] || 0),
        [5]: parseInt(waitTotal[5] || 0) - parseInt(newList[idx][5] || 0),
        [6]: parseInt(waitTotal[6] || 0) - parseInt(newList[idx][6] || 0),
        [7]: parseInt(waitTotal[7] || 0) - parseInt(newList[idx][7] || 0),
      }
      setAcceptTotal(newAcceptTotal);
      setwaitTotal(newWaitTotal);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleReserveReject(reserveId) {
    try {
      const response = await fetch(`/api/stock/reserveList/reject/${reserveId}`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Network response error!');
      }

      const rejectedItem = reserveList.find(e => e.id === reserveId);
      setReserveList(reserveList.filter(e => e.id !== reserveId));
      const newWaitTotal = {
        [1]: parseInt(waitTotal[1] || 0) - parseInt(rejectedItem[1] || 0),
        [2]: parseInt(waitTotal[2] || 0) - parseInt(rejectedItem[2] || 0),
        [3]: parseInt(waitTotal[3] || 0) - parseInt(rejectedItem[3] || 0),
        [4]: parseInt(waitTotal[4] || 0) - parseInt(rejectedItem[4] || 0),
        [5]: parseInt(waitTotal[5] || 0) - parseInt(rejectedItem[5] || 0),
        [6]: parseInt(waitTotal[6] || 0) - parseInt(rejectedItem[6] || 0),
        [7]: parseInt(waitTotal[7] || 0) - parseInt(rejectedItem[7] || 0),
      }
      setwaitTotal(newWaitTotal);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRelease(id, amount) {
    navigate('/registRelease', {
      state: {
        id: id,
        [1]: parseInt(amount[1]), [2]: parseInt(amount[2]), [3]: parseInt(amount[3]), [4]: parseInt(amount[4]),
        [5]: parseInt(amount[5]), [6]: parseInt(amount[6]), [7]: parseInt(amount[7]),
      }
    });
  }

  return (
    <BasicLayout>
      <div className="container mx-auto px-4 py-20">

        <div className="flex font-bold mb-4 text-sub border-b">
          <h1 className="text-2xl font-bold mb-6 text-sub">출고 예약</h1>
          <div className='flex-col text-sub ml-auto'>
            <div>확정된 예약 물량 ={`> 1: ${acceptTotal[1]} 2: ${acceptTotal[2]} 3: ${acceptTotal[3]} 4: ${acceptTotal[4]} 5: ${acceptTotal[5]} 6: ${acceptTotal[6]} 7: ${acceptTotal[7]}`}</div>
            <div>대기중인 예약 물량 ={`> 1: ${waitTotal[1]} 2: ${waitTotal[2]} 3: ${waitTotal[3]} 4: ${waitTotal[4]} 5: ${waitTotal[5]} 6: ${waitTotal[6]} 7: ${waitTotal[7]}`}</div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div id="loading-spinner" className="flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) :
            reserveList.length > 0 ? (
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-baritem text-main">
                    <th className="px-4 py-2 border-b border-bor text-lg">예약일자</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">1</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">2</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">3</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">4</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">5</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">6</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">7</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">예약사</th>
                    <th className="px-4 py-2 border-b border-bor text-lg">승인 여부</th>
                  </tr>
                </thead>
                <tbody>
                  {reserveList.map((reserveItem) => (
                    <tr
                      key={reserveItem.id}
                      className="hover:bg-hov transition-colors duration-300"
                    >
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {reserveItem.date || '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {reserveItem[1] || '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {reserveItem[2] || '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {reserveItem[3] || '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {reserveItem[4] || '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {reserveItem[5] || '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {reserveItem[6] || '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {reserveItem[7] || '-'}
                      </td>
                      <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                        {reserveItem.customer}
                      </td>
                      {
                        reserveItem.accept === 0 ? (
                          <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                            <button
                              onClick={() => handleReserveAccept(reserveItem.id)}
                              className={`transition-colors duration-300 text-white py-2 px-4 rounded bg-button2 hover:bg-button2Hov mx-3`}
                            >
                              O
                            </button>
                            <button
                              onClick={() => handleReserveReject(reserveItem.id)}
                              className={`transition-colors duration-300 text-white py-2 px-4 rounded bg-button4 hover:bg-button2Hov`}
                            >
                              X
                            </button>
                          </td>
                        ) : (
                          <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                            <span className='px-5'>예약됨</span>
                            <button
                              onClick={() => handleRelease(reserveItem.id, [0, reserveItem[1], reserveItem[2], reserveItem[3], reserveItem[4], reserveItem[5], reserveItem[6], reserveItem[7]])}
                              className={`transition-colors duration-300 text-white py-2 px-4 rounded bg-button hover:bg-button2Hov`}
                            >
                              출고하기
                            </button>
                          </td>
                        )
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-lg text-sub mt-8">예약 내역이 없습니다.</p>
            )}
        </div>
      </div>
    </BasicLayout>
  )
}

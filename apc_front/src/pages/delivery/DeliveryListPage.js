import React, { useState, useEffect } from 'react';
import BasicLayout from '../../layout/BasicLayout';
import { useAuthStore } from '../../store/AuthStore';
import { useUserStore } from '../../store/UserStore';

const { REACT_APP_NGROK_URL } = process.env;

const DeliveryListPage = () => {

  const { user } = useAuthStore()
  const { id, replaceId } = useUserStore();
  const [ deliveries, setDeliveries] = useState([]);

  async function getOrderInfo() {
    try {
      const response = await fetch(REACT_APP_NGROK_URL + `/orders/${id}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response error!');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching order info:', error);
      throw error;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOrderInfo(id);
        if (data) {
          const ordersArray = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setDeliveries(ordersArray);
          console.log(deliveries);
        } else {
          setDeliveries([]);
        }
      } catch (error) {
        alert("배송 정보를 가져오던 중 에러가 발생했습니다.: " + error.message);
      }
    };
    fetchData();
  }, [id]);

  if (!user || id == null) {
    return(
      <BasicLayout>
        <p className='pt-20 text-3xl text-baritem'>
        로그인 후 이용하십시오.
        </p>

      </BasicLayout>
    )
  }

  return (
    <BasicLayout>
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold mb-4 text-sub border-b border-gray-300 ">
        {replaceId(id)} 님의 배송 내역
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-baritem text-main">
                <th className="px-4 py-2 border-b border-bor">운송장 번호</th>
                <th className="px-4 py-2 border-b border-bor">배송품 이름</th>
                <th className="px-4 py-2 border-b border-bor">주문 일자</th>
                <th className="px-4 py-2 border-b border-bor">배송 상태</th>
                <th className="px-4 py-2 border-b border-bor">배송 출발 시간</th>
                <th className="px-4 py-2 border-b border-bor">배송 완료 시간</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr
                  key={delivery.id}
                  className="hover:bg-hov cursor-pointer transition-colors duration-300"
                >
                  <td className="border-b border-bor px-4 py-2 text-sub text-center">
                    {delivery.trackingNum || '-'}
                  </td>
                  <td className="border-b border-bor px-4 py-2 text-sub text-center">
                    {delivery.orderedProductName}
                  </td>
                  <td className="border-b border-bor px-4 py-2 text-sub text-center">
                    {delivery.orderedDate}
                  </td>
                  <td className="border-b border-bor px-4 py-2 text-sub text-center">
                  {(() => {
                      switch (delivery.deliveryStatus) {
                        case 0:
                          return '배송 대기';
                        case 1:
                          return '배송 중';
                        case 2:
                          return '배송 완료';
                      }
                  })()}
                  </td>
                  <td className="border-b border-bor px-4 py-2 text-sub text-center">
                    {delivery.departedDate || '-'}
                  </td>
                  <td className="border-b border-bor px-4 py-2 text-sub text-center">
                    {delivery.arrivedDate || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BasicLayout>
  );
};

export default DeliveryListPage;

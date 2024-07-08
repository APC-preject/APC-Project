import React, { useState, useEffect } from 'react';
import BasicLayout from '../../layout/BasicLayout';
import { useAuthStore } from '../../store/AuthStore';
import { useUserStore } from '../../store/UserStore';

const DeliveryListPage = () => {
  const { user } = useAuthStore();
  const { id, replaceId } = useUserStore();
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getOrderInfo(id) {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response error!');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (id === null) {
        return;
      }
      try {
        const data = await getOrderInfo(id);
        if (data) {
          const ordersArray = Object.entries(data).reverse().map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setDeliveries(ordersArray);
        } else {
          setDeliveries([]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching delivery information:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (!user || id === null) {
    return (
      <BasicLayout>
        <p className='pt-20 text-3xl text-baritem'>
          로그인 후 이용하십시오.
        </p>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold mb-4 text-sub border-b border-gray-300">
          {replaceId(id)} 님의 배송 내역
        </h1>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div id="loading-spinner" className="flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) :
          deliveries.length > 0 ? (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-baritem text-main">
                  <th className="px-4 py-2 border-b border-bor text-lg">운송장 번호</th>
                  <th className="px-4 py-2 border-b border-bor text-lg">배송품 이름</th>
                  <th className="px-4 py-2 border-b border-bor text-lg">주문 일자</th>
                  <th className="px-4 py-2 border-b border-bor text-lg">배송 상태</th>
                  <th className="px-4 py-2 border-b border-bor text-lg">배송 출발 시간</th>
                  <th className="px-4 py-2 border-b border-bor text-lg">배송 완료 시간</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery) => (
                  <tr
                    key={delivery.id}
                    className="hover:bg-hov cursor-pointer transition-colors duration-300"
                  >
                    <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                      {delivery.trackingNum || '-'}
                    </td>
                    <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                      {delivery.orderedProductName}
                    </td>
                    <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                      {delivery.orderedDate}
                    </td>
                    <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                      {(() => {
                        switch (delivery.deliveryStatus) {
                          case 0:
                            return '배송 대기';
                          case 1:
                            return '배송 중';
                          case 2:
                            return '배송 완료';
                          default:
                            return '-';
                        }
                      })()}
                    </td>
                    <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                      {delivery.departedDate || '-'}
                    </td>
                    <td className="border-b border-bor px-4 py-2 text-sub text-center text-lg">
                      {delivery.arrivedDate || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-lg text-sub mt-8">배송 내역이 없습니다.</p>
          )}
        </div>
      </div>
    </BasicLayout>
  );
};

export default DeliveryListPage;

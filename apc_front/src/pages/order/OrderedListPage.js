import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicLayout from '../../layout/BasicLayout';
import { useAuthStore } from '../../store/AuthStore';
import { useUserStore } from '../../store/UserStore';

const OrderedListPage = () => {
  const { user } = useAuthStore();
  const { id, replaceId } = useUserStore();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
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
      return null;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (id === null) return;
      try {
        const data = await getOrderInfo(id);
        if (data) {
          const ordersArray = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setOrders(ordersArray.reverse());
        } else {
          setOrders([]);
        }
        setIsLoading(false);
      } catch (error) {
        alert("주문 정보를 가져오던 중 에러가 발생했습니다: " + error.message);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (!user || id == null) {
    return (
      <BasicLayout>
        <p className='pt-20 text-3xl text-baritem'>
          로그인 후 이용하십시오.
        </p>
      </BasicLayout>
    );
  }

  const handleRowClick = (orderedProductId) => {
    navigate(`/product/detail?id=${orderedProductId}`);
  };

  return (
    <BasicLayout>
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold mb-4 text-sub border-b border-gray-300 ">
          {replaceId(id)} 님의 주문 내역
        </h1>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div id="loading-spinner" className="flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : 
          orders.length > 0 ? (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-baritem text-main">
                  <th className="px-4 py-2 border-b border-bor">상품명</th>
                  <th className="px-4 py-2 border-b border-bor">수량(kg)</th>
                  <th className="px-4 py-2 border-b border-bor">가격</th>
                  <th className="px-4 py-2 border-b border-bor">주문 일자</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-hov transition-colors duration-300 cursor-pointer"
                    onClick={() => handleRowClick(order.orderedProductId)}
                  >
                    <td className="border-b border-bor text-lg px-4 py-2 text-sub text-center">{order.orderedProductName}</td>
                    <td className="border-b border-bor text-lg px-4 py-2 text-sub text-center">{order.orderedQuantity}kg</td>
                    <td className="border-b border-bor text-lg px-4 py-2 text-sub text-center">{order.orderedPrice}원</td>
                    <td className="border-b border-bor text-lg px-4 py-2 text-sub text-center">{order.orderedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-lg text-sub mt-8">주문 내역이 없습니다.</p>
          )}
        </div>
      </div>
    </BasicLayout>
  );
};

export default OrderedListPage;

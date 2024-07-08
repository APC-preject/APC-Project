import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BasicLayout from '../../layout/BasicLayout';
import { useUserStore } from '../../store/UserStore';
import { useAuthStore } from '../../store/AuthStore';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const { id, role, replaceId } = useUserStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  function replace(userId) {
    return userId.replace('_', '.')
  }

  // 배송 대기 목록 조회 함수
  async function getDeliveryWaits(providerId) {
    try {
      const response = await fetch(`/api/orders/deliveryWaits/${providerId}`, {
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
    const fetchDeliveryWaitData = async () => {
      if (id === null) return;
      try {
        const ordersData = await getDeliveryWaits(id);
        if (ordersData) {
          setOrders(ordersData)
        } else {
          throw new Error();
        }
        setIsLoading(false);
      } catch (error) {
        console.error('상품 상세정보를 가져오는 도중 문제가 발생했습니다: ' + error.message);
        setIsLoading(false);
      }
    };
    fetchDeliveryWaitData();
  }, [id]);

  const handleDeliveryButtonClick = (userId, orderId) => {
    navigate(`/product/order/management/detail?userId=${userId}&orderId=${orderId}`);
  };

  if (!user || id == null || role != 1) {
    return (
      <BasicLayout>
        <p className="pt-20 text-3xl text-baritem">판매자 계정으로 로그인 후 이용하십시오.</p>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <div className="flex flex-col items-center">
        <div className="flex justify-center mt-20 text-2xl text-listbg font-bold">
          {replaceId(id)} 님의 주문 관리 페이지
        </div>
        <br></br>
        <h2 className="text-2xl font-bold mb-4 text-sub border-b border-gray-300 pb-2 w-full text-center">
          배송 대기 목록
        </h2>
        {(() => {
          const list = Object.entries(orders).reverse().filter(([productId, productOrders]) => {
            return Object.entries(productOrders).filter(([orderId, order]) => {return (order.deliveryStatus !== 2);}).length;
          });
          if (isLoading) return (
            <div id="loading-spinner" className="flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          );
          return (
            list.length === 0 ? (
              <div className="text-baritem mb-5">주문 대기 내역이 없습니다.</div>
            ) : (
              list.map(([productId, productOrders]) => { return (
            <div
              key={productId}
              className="flex flex-col justify-center items-center mt-3 mb-3 bg-textbg py-6 rounded-lg shadow-md w-full max-w-6xl"
            >
              <h2 className="text-2xl font-bold mb-4 text-sub border-b border-gray-300 pb-2 w-full text-center">
                {productOrders[Object.keys(productOrders)[0]].productName} 배송 현황 목록
              </h2>
              <table className="w-full text-center table-auto">
                <thead>
                  <tr className="text-sub">
                    <th className="py-3 px-6 text-lg">주문 ID</th>
                    <th className="py-3 px-6 text-lg">주문자 ID</th>
                    <th className="py-3 px-6 text-lg">주문 날짜</th>
                    <th className="py-3 px-6 text-lg">배송 상태</th>
                    <th className="py-3 px-6 text-lg">배송 관리</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(productOrders).reverse().map(([orderId, order]) => (
                    <tr key={orderId} className="text-button2">
                      <td className="py-3 px-6 text-white">{orderId}</td>
                      <td className="py-3 px-6 text-white text-base text-lg">{replace(order.userID)}</td>
                      <td className="py-3 px-6 text-white text-base text-lg">{order.orderedDate || ''}</td>
                      <td className="py-3 px-6 text-white text-base text-lg">{order.deliveryStatus == 0 ? "배송 이전" : "배송 중"}</td>
                      <td className="py-3 px-6 text-white text-base text-lg">
                        <button
                          onClick={() => handleDeliveryButtonClick(order.userID, orderId)}
                          className={`transition-colors duration-300 text-white py-2 px-4 rounded ${order.deliveryStatus == 0 ? 'bg-button2 hover:bg-button2Hov' : 'bg-button4 hover:bg-button4Hov'}`}
                        >
                          {order.deliveryStatus == 0 ? "배송 처리" : "도착 처리"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                  </table>
                </div>
              );})
            )
          );
        })()}

        <br></br>
        <h2 className="text-2xl font-bold mb-4 text-sub border-b border-gray-300 pb-2 w-full text-center">
          배송 완료 목록
        </h2>
        {(() => {
          const list = Object.entries(orders).reverse().filter(([productId, productOrders]) => {
            return Object.entries(productOrders).filter(([orderId, order]) => {return (order.deliveryStatus === 2);}).length;
          });
          if (isLoading) return (
            <div id="loading-spinner" className="flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          );
          return (
            list.length === 0 ? (
              <div className="text-baritem mb-5">주문 완료 내역이 없습니다.</div>
            ) : (
              list.map(([productId, productOrders]) => { return (
                <div
                  key={productId}
                  className="flex flex-col justify-center items-center mt-3 mb-3 bg-textbg py-6 rounded-lg shadow-md w-full max-w-6xl"
                >
                  <h2 className="text-2xl font-bold mb-4 text-sub border-b border-gray-300 pb-2 w-full text-center">
                    {productOrders[Object.keys(productOrders)[0]].productName} 배송 완료 목록
                  </h2>
                  <table className="w-full text-center table-auto">
                    <thead>
                      <tr className="text-sub">
                        <th className="py-3 px-6 text-lg">주문 ID</th>
                        <th className="py-3 px-6 text-lg">주문자 ID</th>
                        <th className="py-3 px-6 text-lg">주문 날짜</th>
                        <th className="py-3 px-6 text-lg">배송 상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(productOrders).reverse().filter(([orderId, order]) => order.deliveryStatus === 2).map(([orderId, order]) => (
                        <tr key={orderId} className="text-button2">
                          <td className="py-3 px-6 text-white">{orderId}</td>
                          <td className="py-3 px-6 text-white text-base text-lg">{replace(order.userID)}</td>
                          <td className="py-3 px-6 text-white text-base text-lg">{order.orderedDate || ''}</td>
                          <td className="py-3 px-6 text-white text-base text-lg">배송 완료</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );})
            )
          );
        })()}
      </div>
    </BasicLayout>
  );
};

export default OrderManagementPage;

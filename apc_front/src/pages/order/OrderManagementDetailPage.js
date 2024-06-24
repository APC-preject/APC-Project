import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BasicLayout from '../../layout/BasicLayout';
import { databaseRef, get, update, getDatabase } from '../../firebase/FirebaseInstance'
import { useUserStore } from '../../store/UserStore';

const OrderManagementDetailPage = () => {
  const {id} = useUserStore()
  const [queryParams] = useSearchParams();
  const userId = queryParams.get('userId');
  const replacedUserId = userId.replace('_', '.');
  const orderId = queryParams.get('orderId');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isDeparted, setIsDeparted] = useState(false); // 배송 출발 여부 상태 추가
  const database = getDatabase()
  const navigate = useNavigate()
  const [gettedTrackingNumber, setGettedTrackingNumber] = useState('')
  const [orderInfo, setOrderInfo] = useState({
    productId: '',
    productName: '',
    orderedQuantity: 3,
    roadAddress: '',
    detailAddress: ''
  });

  
  const handleTrackingNumberChange = (e) => {
    setTrackingNumber(e.target.value);
  };
  
  //배송 출발 처리
  const handleProcessDelivery = () => {
    try{
      if (trackingNumber === '') {
        alert('운송장 번호를 입력해주십시오')
        return
      }
      const departedDate = new Date().toLocaleString();
      const updates = {}
      updates[`orders/${userId}/${orderId}/departedDate`] = departedDate
      updates[`orders/${userId}/${orderId}/deliveryStatus`] = 1
      updates[`deliveryWaits/${id}/${orderInfo.productId}/${orderId}/deliveryStatus`] = 1
      updates[`orders/${userId}/${orderId}/trackingNum`] = trackingNumber
      // 배송 상태 업데이트
      update(databaseRef(database), updates)
      setIsDeparted(true)
      alert('배송 출발 처리 완료')
      handleNavigateOrderManagement()    
    } catch(error) {
      alert ('배송 출발 처리에 실패했습니다.', error)
    }
    
     
  };
  //배송 도착 처리
  const handleArrivalDelivery = () => {
    try{
      const arrivedDate = new Date().toLocaleString();
      const updates = {}
      updates[`orders/${userId}/${orderId}/arrivedDate`] = arrivedDate
      updates[`orders/${userId}/${orderId}/deliveryStatus`] = 2
      updates[`deliveryWaits/${id}/${orderInfo.productId}/${orderId}`] = null
    
      update(databaseRef(database), updates)
      alert('배송 도착 처리 완료')
      handleNavigateOrderManagement()
    } catch(error) {
      alert('도착 완료 처리에 실패했습니다.', error)
    }
    
  };

  // 주문 관리 목록으로 이동
  const handleNavigateOrderManagement = () => {
    navigate({ pathname: '/product/order/management' });
  }

  //배송 출발 상태 조회 함수
  async function getOrderInfo() {
    const orderRef = databaseRef(database, `orders/${userId}/${orderId}`);
    const snapshot = await get(orderRef);
    return snapshot.val();
  }

  // 주문 상세 데이터 조회 처리
  useEffect(() => {
    const fetchOrderInfo = async () => {
      try {
        const orderData = await getOrderInfo();
        
        setOrderInfo({
          productId: orderData.orderedProductId,
          productName: orderData.orderedProductName,
          orderedQuantity: orderData.orderedQuantity,
          roadAddress: orderData.roadAddress,
          detailAddress: orderData.detailAddress
        });
        if(orderData.deliveryStatus === 0){

        } else if (orderData.deliveryStatus === 1) {
          setGettedTrackingNumber(orderData.trackingNum)
          setIsDeparted(true);
        }
        
        
      } catch (error) {
        console.error('Error fetching order info:', error);
      }
    };
    fetchOrderInfo();
  }, []);

  
  

  return (
    <BasicLayout>
      <div className="flex flex-col items-center">
        <div className="flex justify-center m-8 mt-20 text-2xl text-listbg font-bold">
          배송 처리
        </div>
        <div className="flex justify-center items-center m-8 border border-bor bg-textbg p-20 rounded-lg shadow-md">
          <div className="flex flex-col items-start">
            <div className="text-lg text-sub border-b border-gray-500 mb-8">주문자 ID: {replacedUserId}</div>
            <div className="text-lg text-sub border-b border-gray-500 mb-8">주문 번호: {orderId}</div>
            <div className="text-lg text-sub border-b border-gray-500 mb-8">상품명: {orderInfo.productName}</div>
            <div className="text-lg text-sub border-b border-gray-500 mb-8">주문 수량: {orderInfo.orderedQuantity} kg</div>
            <div className="flex items-center text-lg border-b border-gray-500 text-sub mb-8">
            <label htmlFor="trackingNumber" className="mr-2">
              운송장 번호:
            </label>
              {isDeparted ? (
                <input
                  type="text"
                  id="trackingNumber"
                  value={gettedTrackingNumber} // isDeparted가 true일 때 gettedTrackingNumber를 표시
                  className="w-60 px-1 py-1 bg-textbg text-sub rounded text-l"
                  readOnly // 읽기 전용으로 설정하여 사용자가 편집할 수 없게 함
                />
              ) : (
                <input
                  type="text"
                  id="trackingNumber"
                  value={trackingNumber}
                  onChange={handleTrackingNumberChange}
                  className="w-60 px-1 py-1 bg-textbg border border-gray-500 text-sub rounded text-l"
                  placeholder="운송장 번호를 입력해주세요"
                />
              )}
            </div>
            <div className="text-lg text-sub border-b border-gray-500 mb-8">도로명 주소: {orderInfo.roadAddress}</div>
            <div className="text-lg text-sub border-b border-gray-500 mb-8">상세 주소: {orderInfo.detailAddress}</div>
            <div className="flex">
              {!isDeparted ? 
                ( // isDeparted가 true이면 도착 처리 버튼을 보이지 않도록 설정
                <button
                  onClick={handleProcessDelivery}
                  className="bg-button2 hover:bg-button2Hov transition-colors duration-300 text-white px-4 py-2 rounded mt-3"
                >
                배송 처리
                </button>
                ) : null
              }
              {isDeparted ? ( // isDeparted가 true이면 도착 처리 버튼을 보이지 않도록 설정
                <button
                  onClick={handleArrivalDelivery}
                  className="bg-button2 hover:bg-button2Hov transition-colors duration-300 text-white px-4 py-2 rounded mt-3"
                >
                도착 처리
                </button>
                ) : null
              }
            </div>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default OrderManagementDetailPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicLayout from '../../layout/BasicLayout';
import axios from 'axios';
import { useAuthStore } from '../../store/AuthStore';
import { useUserStore } from '../../store/UserStore';


function ReviewableListPage() {
  const { user } = useAuthStore();
  const { id, replaceId } = useUserStore();
  const navigate = useNavigate();
  const [reviewables, setReviewables] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !id) {
        return
      }
      try {
        const response = await axios.get(`http://localhost:14000/orders/${id}`, {
          withCredentials: true,
        });
        const data = response.data;
        const ordersArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        const reviewableArray = ordersArray.filter(order => order.deliveryStatus === 2 && order.isReviewed === 0);
        setReviewables(reviewableArray)
      } catch (error) {
        alert("배송 정보를 가져오던 중 에러가 발생했습니다.: " + error.message);
      }
    };
    fetchData();
  }, [id]);

  // 리뷰 작성 페이지로 이동하는 함수
  const handleNavigateReviewPage = (productId, orderId) => {
    navigate(`/review/register?productId=${productId}&orderId=${orderId}`);
  };

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
        {replaceId(id)} 님의 리뷰 가능한 제품 목록
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-baritem text-main">
                <th className="px-4 py-2 border-b border-bor">제품 이름</th>
                <th className="px-4 py-2 border-b border-bor">주문 일자</th>
                <th className="px-4 py-2 border-b border-bor">배송완료 일자</th>
              </tr>
            </thead>
            <tbody>
              {reviewables.map(reviewableOrders => (
                <tr
                  key={reviewableOrders.key}
                  className="hover:bg-hov transition-colors duration-300 cursor-pointer"
                  onClick={() => handleNavigateReviewPage(reviewableOrders.orderedProductId, reviewableOrders.id)}
                >
                  <td className="border-b border-bor px-4 py-2 text-sub text-center">
                    {reviewableOrders.orderedProductName}
                  </td>
                  <td className="border-b border-bor px-4 py-2 text-sub text-center">
                    {reviewableOrders.orderedDate}
                  </td>
                  <td className="border-b border-bor px-4 py-2 text-sub text-center">
                    {reviewableOrders.arrivedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BasicLayout>
  );
}

export default ReviewableListPage;


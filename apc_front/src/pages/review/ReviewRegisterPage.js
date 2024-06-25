import React, { useState, useEffect } from 'react';
import { useSearchParams , useNavigate } from 'react-router-dom';
import BasicLayout from '../../layout/BasicLayout';
import { useAuthStore } from '../../store/AuthStore';
import axios from 'axios';
import { useUserStore } from '../../store/UserStore';

function ReviewRegisterPage() {
  const { user } = useAuthStore();
  const { id } = useUserStore();
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState(null);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [queryParams] = useSearchParams();
  const productId = queryParams.get('productId');
  const orderId = queryParams.get('orderId');

  const handleRatingChange = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleNavigateReviewalbeList = () => {
    navigate(`/review/ableList`);
  };

  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:4002/products/${productId}`);
        const productData = response.data;
        setProductInfo({
          id : productId,
          name : productData.pName
        });
      } catch (error) {
        alert('제품 정보를 불러오는데 오류가 발생했습니다.', error)
        console.log(error)
      }
    };
    fetchProductInfo();
  }, []);


  const handleSubmit = async() => {
    const reviewData = {
      userID : id,
      rating,
      content
    };
    try {
      await axios.post('http://localhost:4002/reviews', {
        userId: id,
        productId,
        orderId,
        reviewData
      });
      navigate(`/review/ableList`);
    } catch(error) {
      alert('리뷰를 등록하는데 실패했습니다.');
      console.log(error);
    }
  };

  if (!user) {
    return(
      <BasicLayout>
        <p className='pt-20 text-3xl text-baritem'>
          로그인 후 이용하십시오.
        </p>

      </BasicLayout>
    )
  }

  if (!productInfo) {
    return <div className='text-sub'>404</div>;
  }

  return (
    <BasicLayout>
      <div className="container mx-auto px-4 p-20">
        <h1 className="text-2xl font-bold mb-4 text-sub border-b border-sub">리뷰 작성</h1>
        <div className="bg-main shadow-md rounded-lg p-6 border border-bor">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-sub ">제품 정보</h2>
            <p className="text-sub">제품명: {productInfo.name}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-sub">평점</h2>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`mr-1 text-2xl focus:outline-none ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => handleRatingChange(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-sub">리뷰 내용</h2>
            <textarea
              className="w-full px-3 py-2 text-sub border border-bor rounded-lg focus:outline-none focus:border-blue-500 bg-textbg"
              rows="4"
              placeholder="리뷰 내용을 입력해주세요."
              value={content}
              onChange={handleContentChange}
            ></textarea>
          </div>
          <button
            className="bg-button2 hover:bg-button2Hov text-white font-semibold py-2 px-4 rounded-lg focus:outline-none"
            onClick={handleSubmit}
          >
            등록
          </button>
        </div>
      </div>
    </BasicLayout>
  );
}

export default ReviewRegisterPage;


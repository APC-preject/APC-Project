import React, { useState, useEffect, useCallback } from 'react';
import BasicLayout from '../../layout/BasicLayout';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { get, ref as databaseRef, getDatabase, push, runTransaction, update } from 'firebase/database';
import { useUserStore } from '../../store/UserStore';
import { useAuthStore } from '../../store/AuthStore';
import MessageModal from '../../modal/MessageModal';

const ProductDetailPage = () => {
  const [queryParams] = useSearchParams();
  const productId = queryParams.get('id');
  const [quantity, setQuantity] = useState(0);
  const [orderMessage, setOrderMessage] = useState('');
  const [product, setProduct] = useState(null);
  const [leftQuantity, setLeftQuantity] = useState(0);
  const [providerName, setProviderName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { id } = useUserStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [roadAddress, setRoadAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [provider_Name, setProvider_Name] = useState('');
  const database = getDatabase();
  const [reviews, setReviews] = useState([{}]);
  
  // 도로명 주소 입력 변화
  const handleRoadAddressChange = (e) => {
    setRoadAddress(e.target.value);
  };

  // 상세 주소 입력 변화
  const handleDetailAddressChange = (e) => {
    setDetailAddress(e.target.value);
  };

  // 제품 목록으로 네비게이트
  const handleNavigateProductList = useCallback(() => {
    navigate({ pathname: '/product/list' });
  }, [navigate]);

  // 수량 입력 변화
  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  // 제품 정보 조회 함수
  async function getProductInfo(productId) {
    const productsRef = databaseRef(database, `products/${productId}`);
    const snapshot = await get(productsRef);
    return snapshot;
  }

  // 제품 리뷰 목록 조회 함수
  async function getReviewList() {
    const reviewRef = databaseRef(database, `reviews/${productId}`)
    const snapshot = await get(reviewRef)
    return snapshot.val()
  }

  // 컴포넌트 마운트 시, 제품 상세정보 조회, 리뷰 조회 실행
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const snapshot = await getProductInfo(productId);
        if (snapshot.exists()) {
          const data = snapshot.val();
          data.id = productId;
          setLeftQuantity(data.pQuantity);
          setProduct(data);
          setProvider_Name(data.providerName.replace(".", "_"));
          setProviderName(data.providerName);

          try {
            getReviewList().then(reviewData => {
              if (reviewData) {
                  const reviewsArray = Object.entries(reviewData).map(([key, value]) => ({
                      id: key,
                      ...value,
                  }));
                  setReviews(reviewsArray);
                  console.log(reviewData);
              } else {
                  setReviews([])
                  return;
              }
            })
          } catch (error){
            alert('리뷰 목록을 가져오는 도중 문제가 발생했습니다.' + error.message)
          }


        } else {
          alert('Id에 해당하는 상품이 존재하지 않습니다.');
        }
      } catch (error) {
        alert('상품 상세정보를 가져오는 도중 문제가 발생했습니다.: ' + error.message);
      }
    };
    fetchProductData();
  }, [productId]);

  // 주문 버튼 눌렀을 때의 처리
  const handleOrder = () => {
    if (id == null || !user) {
      alert('로그인 후 주문해주세요.');
      return;
    }

    if (quantity <= 0) {
      setOrderMessage('주문 수량을 선택해주세요.');
      return;
    }

    if (roadAddress == null) {
      alert('도로명 주소를 입력해주세요');
      return;
    }

    if (detailAddress == null) {
      alert('상세 주소를 입력해주세요');
      return;
    }

    setShowModal(true); // 모달을 보여줌
  };

  // 모달에서 확인을 눌렀을 때 실제 주문 처리
  const handleConfirmOrder = async () => {
    const orderRef = databaseRef(database, `orders/${id}`);
    const orderedDate = new Date().toLocaleString();
    const productName = product.pName;
    const orderedPrice = product.pPrice * quantity;
    const orderedProductId = productId;

    // 수량 업데이트 및 검사로직
    try {
      const productRef = databaseRef(database, `products/${productId}`);

      await runTransaction(productRef, (product) => {
        if (product) {
          if (product.pQuantity >= quantity) {
            product.pQuantity -= quantity;
          } else {
            throw new Error('주문 수량이 재고 수량보다 많습니다.');
          }
        }
        return product;
      });

      try {
        // 새로운 주문 정보
        const newOrder = {
          orderedDate,
          orderedProductId,
          orderedProductName: productName,
          orderedQuantity: quantity,
          orderedPrice,
          trackingNum: '',
          deliveryStatus: 0,
          departedDate: '',
          arrivedDate: '',
          isReviewed: 0,
          roadAddress: roadAddress,
          detailAddress: detailAddress,
        };

        const newDeliveryWait = {
          userID: id,
          productName : productName,
          orderedDate,
          deliveryStatus : 0
        };
        // 주문 정보 db에 저장
        const newOrderRef = push(orderRef);

        const orderID = newOrderRef.key;

        const updates = {};
        updates[`orders/${id}/${orderID}`] = newOrder;
        updates[`deliveryWaits/${provider_Name}/${productId}/${orderID}`] = newDeliveryWait;

        // 주문 관련 데이터 동시 업데이트 (원자성 만족)
        await update(databaseRef(database), updates);

        alert(`총 ${quantity}kg 주문하셨습니다. 가격은 ${orderedPrice}원 입니다.`);
        handleNavigateProductList();
      } catch (error) {
        alert('주문 데이터 저장 중 문제가 발생했습니다.', error);
        // 주문 데이터 저장 중 문제 생겼으니 뺏던 수량 원상 복구
        await runTransaction(productRef, (product) => {
          if (product) {
            product.pQuantity += quantity;
          }
          return product;
        });
        return;
      }
    } catch (error) {
      alert('수량 확인 및 업데이트 중 문제가 발생했습니다.', error);
      return;
    }
  };

  //Todo: 실제 상품이 존재하지 않는 경우가 아니라 database에서 로드되는 도중에도 이부분이 잠시 나타남. 이에 대한 처리 필요
  if (!product) {
    return <div className="text-sub">상품을 찾을 수 없습니다.</div>;
  }

  return (
    <BasicLayout>
      {/* 사진과 주문 창 */}
      <div className="container mx-auto py-20 px-4">
        <h1 className="text-2xl font-bold mb-6 border-b  text-sub">상품 상세</h1>
      <div className="flex justify-center my-8 border bg-textbg border-bor text-2xl text-listbg font-bold">
        {providerName} 님의 상품
      </div>
      <div className="flex justify-center items-center  border border-bor bg-textbg">
        <div className="flex w-full items-stretch">
          <div className="w-1/2 flex flex-col justify-center">
            <img src={product.pImageUrl} alt="Fruit" className="w-full h-full object-cover mx-auto p-10" />
          </div>
          <div className="w-1/2 flex flex-col items-start p-10 justify-center">
            <div className="text-2xl text-sub font-bold mb-2">{product.pName}</div>
            <div className="text-lg text-sub mb-2">가격 : 1kg/{product.pPrice}원</div>
            <div className="text-lg text-sub mb-2">남은 수량(kg) : {leftQuantity}kg</div>
            <div className="flex items-center text-lg text-sub mb-2">
              <label htmlFor="quantity" className="mr-2">주문 수량(kg) :</label>
              <input
                type="number"
                id="quantity"
                min="0"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-20 px-2 py-1 bg-textbg border border-bor text-sub rounded"
              />
            </div>
            <div className="text-lg font-bold mb-2 text-sub">총액 : {product.pPrice * quantity}원</div>
            <div className="flex flex-col items-start text-lg text-sub mb-2">
              <label htmlFor="roadAddress" className="mb-1">도로명 주소:</label>
              <input
                type="text"
                id="roadAddress"
                value={roadAddress}
                onChange={handleRoadAddressChange}
                className="w-full px-2 py-1 bg-textbg border border-gray-500 text-sub rounded"
              />
            </div>
            <div className="flex flex-col items-start text-lg text-sub mb-2">
              <label htmlFor="detailAddress" className="mb-1">상세 주소:</label>
              <input
                type="text"
                id="detailAddress"
                value={detailAddress}
                onChange={handleDetailAddressChange}
                className="w-full px-2 py-1 bg-textbg border border-gray-500 text-sub rounded"
              />
            </div>
            <button
              onClick={handleOrder}
              className="bg-button2 hover:bg-button2Hov transition-colors duration-300 text-white px-4 py-2 rounded"
            >
              주문
            </button>
            {orderMessage && <div className="mt-4 text-baritem">{orderMessage}</div>}

            {showModal && (
            <MessageModal
            message="주문을 확정하시겠습니까?"
            onConfirm={handleConfirmOrder}
            onCancel={() => setShowModal(false)}
            />
            )}
          </div>
        </div>
      </div>
      {/* 제품 상세 설명 */}
      <div className="flex justify-center my-8 items-center border border-bor">
        <div className="p-6 bg-textbg rounded-lg shadow-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-sub">제품 상세 설명</h2>
          <p className="text-baritem">{product.pDescription}</p>
        </div>
      </div>
      {/* 리뷰와 별점 리스트 */}
      <div className="p-3 my-8 bg-textbg">
        <h2 className="text-2xl font-bold mb-4 text-sub">리뷰 및 별점</h2>
        <ul>
          {reviews.map((review) => (
            <li key={review.id} className="mb-4 rounded border border-gray-500">
              <div className="flex items-center mb-2 text-sub">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`text-2xl ${index < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div>
                <span className='text-button2'> {review.userID} </span>
                <span className='text-listbg'> : {review.content} </span>: 
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>  
    </BasicLayout>
  );
};

export default ProductDetailPage;

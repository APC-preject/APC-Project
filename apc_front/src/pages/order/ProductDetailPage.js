import React, { useState, useEffect, useCallback, useRef } from 'react';
import BasicLayout from '../../layout/BasicLayout';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/UserStore';

const ProductDetailPage = () => {
  const [queryParams] = useSearchParams();
  const productId = queryParams.get('id');
  const [product, setProduct] = useState(null);
  const [leftQuantity, setLeftQuantity] = useState(0);
  const [providerName, setProviderName] = useState('');
  const { id } = useUserStore();
  const navigate = useNavigate();
  const [roadAddress] = useState('');
  const [detailAddress] = useState('');
  const [provider_Name, setProvider_Name] = useState('');
  const [reviews, setReviews] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingId, setIsLoadingId] = useState(true);
  const [reviewable, setReviewable] = useState(false);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [isProvider, setIsProvider] = useState(false);
  const [dataModified, setDataModified] = useState(false);

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState('');

  const orderId = useRef(null);

  const handleNavigateProductList = useCallback(() => {
    navigate({ pathname: '/product/list' });
  }, [navigate]);

  async function getProductInfo(productId) {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response error!');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product: ', error);
      return null;
    }
  }

  async function getReviewList() {
    try {
      const response = await fetch(`/api/review/${productId}`, {
        credentials: 'include',
      });
      if (!response.ok && response.status !== 404) {
        throw new Error('Network response error!');
      }
      let data = [];
      if (response.status !== 404) {
        data = await response.json();
      }
      return data;
    } catch (error) {
      console.error('Error fetching product: ', error);
      return null;
    }
  }

  async function checkReviewable() {
    if (!id) return false;
    try {
      const response = await fetch(`/api/orders/${id}`, {
        credentials: 'include',
      });
      const data = await response.json();
      const ordersArray = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...value,
      }));
      const reviewableArray = ordersArray.filter((order) => {
        return (
          order.deliveryStatus === 2 &&
          order.isReviewed === 0 &&
          order.orderedProductId === productId
        );
      });
      if (reviewableArray.length !== 0) {
        orderId.current = reviewableArray[0].id;
        return true;
      } else return false;
    } catch (error) {
      return false;
    }
  }

  const checkProvider = async (userId, productId) => {
    try {
      const response = await fetch(`/api/products/user/${userId}?productId=${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to check provider status.');
      }

      const data = await response.json();
      return data.isProvider;
    } catch (error) {
      console.error('Error checking provider status:', error);
      return false;
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;
      try {
        const data = await getProductInfo(productId);
        if (data) {
          data.id = productId;
          setLeftQuantity(data.pQuantity);
          setProduct(data);
          setProvider_Name(data.providerName.replace('.', '_'));
          setProviderName(data.providerName);

          setProductName(data.pName);
          setPrice(data.pPrice);
          setQuantity(data.pQuantity);
          setDescription(data.pDescription);

          try {
            getReviewList().then((reviewData) => {
              if (reviewData) {
                const reviewsArray = Object.entries(reviewData)
                  .reverse()
                  .map(([key, value]) => ({
                    id: key,
                    ...value,
                  }));
                setReviews(reviewsArray);
              } else {
                setReviews([]);
                return;
              }
            });
          } catch (error) {
            alert('리뷰 목록을 가져오는 도중 문제가 발생했습니다: ' + error.message);
          }
        } else {
          alert('Id에 해당하는 상품이 존재하지 않습니다.');
          navigate('/product/list');
        }
      } catch (error) {
        console.log(error);
        alert('상품 상세정보를 가져오는 도중 문제가 발생했습니다: ' + error.message);
      }
      setIsLoading(false);
    };
    fetchProductData();
  }, [productId]);

  useEffect(() => {
    const idUpdate = async () => {
      if (id) {
        setReviewable(await checkReviewable());
        const isProvider = await checkProvider(id, productId);
        setIsProvider(isProvider);
        setIsLoadingId(false);
      }
    };
    idUpdate();
  }, [id]);

  const handleBuy = () => {
    navigate(`/product/buy?id=${productId}`);
  };

  const handleLogin = () => {
    navigate(`/user/login`);
  };

  const handleRatingChange = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleDataModified = () => {
    setDataModified(true);
  };

  const handleCancelDataModified = () => {
    setProductName(product.pName);
    setPrice(product.pPrice);
    setQuantity(product.pQuantity);
    setDescription(product.pDescription);
    setDataModified(false);
  };

  const uploadDB = async (product_data) => {
    try {
      const response = await fetch(`/api/products/${productId}`, { /// back 쪽에서 메서드 생성 필요
        method: 'PUT',
        body: JSON.stringify({
          product_data: product_data
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Network response error!');
      }
      alert('데이터베이스 저장 완료.');
      return true;
    } catch (error) {
      console.log(error);
      alert('데이터베이스 저장 실패.');
      return false;
    }
  }

  const handleCompleteDataModified = async () => {
    const productData = {
      providerName: id,
      pName: productName,
      pPrice: price,
      pQuantity: quantity,
      pDescription: description,
      pImageUrl: product.pImageUrl,
      registerTime: product.registerTime
    };

    const result = await uploadDB(productData);
    if (result) {
      setDataModified(false);
      navigate(0);
    } else {
      handleCancelDataModified();
    }
  };

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(parseInt(e.target.value));
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleClickQuestion = () => {
    navigate(`/customer/question?product=${productId}`);
  };

  const handleSubmit = async () => {
    const reviewData = {
      userID: id,
      rating,
      content,
    };
    try {
      if (orderId.current === null) throw new Error();
      const response = await fetch('/api/review', {
        method: 'POST',
        body: JSON.stringify({
          userId: id,
          productId: productId,
          orderId: orderId.current,
          reviewData,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      alert('리뷰를 등록하였습니다.');
      setReviewable(await checkReviewable());
      try {
        getReviewList().then((reviewData) => {
          if (reviewData) {
            const reviewsArray = Object.entries(reviewData)
              .reverse()
              .map(([key, value]) => ({
                id: key,
                ...value,
              }));
            setReviews(reviewsArray);
          } else {
            setReviews([]);
            return;
          }
        });
      } catch (error) {
        alert('리뷰 목록을 가져오는 도중 문제가 발생했습니다: ' + error.message);
      }
    } catch (error) {
      alert('리뷰를 등록하는데 실패했습니다.');
    }
  };

  if (isLoading || isLoadingId) {
    return (
      <BasicLayout>
        <style>
          {`
            input[type="number"] {
              -webkit-appearance: none;
              -moz-appearance: textfield;
              appearance: textfield;
            }
            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
              -webkit-appearance: inner-spin-button;
              opacity: 1;
            }
            input[type="number"]::-moz-spin-button,
            input[type="number"]::-moz-inner-spin-button {
              -moz-appearance: inner-spin-button;
              opacity: 1;
            }
          `}
        </style>
        <div className="container mx-auto py-20 px-4" style={{ maxWidth: '1200px' }}>
          <h1 className="text-2xl font-bold mb-6 border-b text-sub">상품 상세</h1>
          <div id="loading-spinner" className="flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        </div>
      </BasicLayout>
    );
  }

  if (!product) {
    return (
      <BasicLayout>
        <style>
          {`
            input[type="number"] {
              -webkit-appearance: none;
              -moz-appearance: textfield;
              appearance: textfield;
            }
            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
              -webkit-appearance: inner-spin-button;
              opacity: 1;
            }
            input[type="number"]::-moz-spin-button,
            input[type="number"]::-moz-inner-spin-button {
              -moz-appearance: inner-spin-button;
              opacity: 1;
            }
          `}
        </style>
        <div className="container mx-auto py-20 px-4" style={{ maxWidth: '1200px' }}>
          <h1 className="text-2xl font-bold mb-6 border-b text-sub">상품 상세</h1>
          <div className='text-sub'>상품을 찾을 수 없습니다</div>
        </div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <style>
        {`
          input[type="number"] {
            -webkit-appearance: none;
            -moz-appearance: textfield;
            appearance: textfield;
          }
          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: inner-spin-button;
            opacity: 1;
          }
          input[type="number"]::-moz-spin-button,
          input[type="number"]::-moz-inner-spin-button {
            -moz-appearance: inner-spin-button;
            opacity: 1;
          }
        `}
      </style>
      {/* 사진과 주문 창 */}
      <div className="container mx-auto py-20 px-4" style={{ maxWidth: '1200px' }}>
        <h1 className="text-2xl font-bold mb-6 border-b text-sub">상품 상세</h1>
        {(() => {
          if (isProvider) {
            return (
              <div className="flex p-3 border bg-textbg border-bor text-2xl text-listbg text-white font-bold">
                본인의 판매 상품
              </div>
            );
          } else {
            return (
              <div className="flex p-3 border bg-textbg border-bor text-2xl text-listbg text-white font-bold">
                {providerName} 님의 상품
              </div>
            );
          }
        })()}
        
        <div className="flex justify-center items-center border border-bor bg-textbg">
          <div className="flex w-full items-stretch">
            <div className="w-1/2 flex flex-col justify-center">
              <img src={product.pImageUrl} alt="Fruit" className="w-full h-full object-cover mx-auto p-3" />
            </div>
            <div className="w-1/2 flex flex-col items-start p-5 justify-center">
              {(() => {
                if (dataModified) {
                  return (
                  <>
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold mb-2 text-sub">상품명</h2>
                      <input
                        className="w-full px-3 py-2 text-sub border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-textbg"
                        type="text"
                        placeholder="상품명을 입력해주세요."
                        value={productName}
                        onChange={handleProductNameChange}
                      />
                    </div>
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold mb-2 text-sub">가격(원) / kg</h2>
                      <input
                        className="w-full px-3 py-2 text-sub border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-textbg"
                        type="number"
                        placeholder="가격을 입력해주세요."
                        value={price}
                        onChange={handlePriceChange}
                      />
                    </div>
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold mb-2 text-sub">수량 (kg)</h2>
                      <input
                        className="w-full px-3 py-2 text-sub border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-textbg"
                        type="number"
                        placeholder="수량을 입력해주세요."
                        value={quantity}
                        onChange={handleQuantityChange}
                      />
                    </div>
                  </>
                  )
                } else {
                  return (
                    <>
                    <div className="w-full text-3xl font-bold mb-6 border-b text-sub">{product.pName}</div>
                    <div className="text-lg text-sub mb-5 mt-5">가격 : {product.pPrice}원/1kg</div>
                    <div className="text-lg text-sub mb-5">남은 수량(kg) : {leftQuantity}kg</div>
                    </>
                  )
                }
              })()}

              {(() => {
                if (!id) {
                  return (
                    <>
                      <button
                        onClick={handleLogin}
                        className="bg-button2 hover:bg-button2Hov transition-colors duration-300 text-white px-4 py-2 rounded mt-5"
                      >
                        로그인 후 주문 가능
                      </button>
                      <button
                        onClick={handleLogin}
                        className="bg-button2 hover:bg-button2Hov transition-colors duration-300 text-white px-4 py-2 rounded mt-5"
                      >
                        로그인 후 문의 가능
                      </button>
                    </>
                  );
                }
                if (isProvider) {
                  if (!dataModified) {
                    return (
                      <button
                        onClick={handleDataModified}
                        className="bg-button2 hover:bg-button2Hov transition-colors duration-300 text-white px-4 py-2 rounded mt-5"
                      >
                        상품 정보 수정하기
                      </button>
                    );
                  } else {
                    return (
                      <>
                      <button
                        onClick={handleCompleteDataModified}
                        className="bg-button2 hover:bg-button2Hov transition-colors duration-300 text-white px-4 py-2 rounded mt-5"
                      >
                        정보 수정 완료
                      </button>
                      <button
                        onClick={handleCancelDataModified}
                        className="bg-button2 hover:bg-button2Hov transition-colors duration-300 text-white px-4 py-2 rounded mt-5"
                      >
                        정보 수정 취소
                      </button>
                      </>
                    );
                  }
                }
                else {
                  if (leftQuantity === 0) {
                    return (
                      <>
                      <div className="bg-button2 transition-colors duration-300 text-white px-4 py-2 rounded mt-5">
                        상품 품절
                      </div>
                      <button
                        onClick={handleClickQuestion}
                        className="bg-button2 hover:bg-button2Hov transition-colors duration-300 text-white px-4 py-2 rounded mt-5"
                      >
                        문의하기
                      </button>
                      </>
                    );
                  }
                  else {
                    return (
                      <>
                        <button
                          onClick={handleBuy}
                          className="bg-button2 hover:bg-button2Hov transition-colors duration-300 text-white px-4 py-2 rounded mt-5"
                        >
                          주문하기
                        </button>
                        <button
                          onClick={handleClickQuestion}
                          className="bg-button2 hover:bg-button2Hov transition-colors duration-300 text-white px-4 py-2 rounded mt-5"
                        >
                          문의하기
                        </button>
                      </>
                    );
                  }
                }
              })()}
            </div>
          </div>
        </div>
        <div className="p-6 bg-textbg rounded-lg shadow-md w-full mt-5 mb-5">
          <h2 className="text-2xl font-bold mb-4 text-sub">제품 상세 설명</h2>
          {(() => {
            if (dataModified) {
              return (
                <textarea
                  className="w-full px-3 py-2 text-sub border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-textbg"
                  rows="4"
                  placeholder="상품에 대한 설명을 입력해주세요."
                  value={description}
                  onChange={handleDescriptionChange}
                ></textarea>
              );
            } else {
              return (
                <p className="text-baritem text-xl text-sub p-2">{product.pDescription}</p>
              );
            }
          })()}
        </div>
        <div className="flex justify-center my-8 items-center border border-bor">
          {(() => {
            if (!id) {
              return (
                <div className="bg-main shadow-md rounded-lg p-6 border border-bor w-full">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2 text-sub">로그인 후 리뷰를 남길 수 있습니다</h2>
                  </div>
                </div>
              );
            } else if (!isProvider && reviewable) {
              return (
                <div className="bg-main shadow-md rounded-lg p-6 border border-bor w-full">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2 text-sub">평점</h2>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          className={`mr-1 text-2xl focus:outline-none ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
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
              );
            } else if (!isProvider) {
              return (
                <div className="bg-main shadow-md rounded-lg p-6 border border-bor w-full">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2 text-sub">구매 후 리뷰를 남길 수 있습니다</h2>
                  </div>
                </div>
              );
            }
          })()}
        </div>
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
                  |
                  <span className='pl-5'>등록 시간: {review.registTime}</span>
                </div>
                <div>
                  <span className="text-button2"> {review.userID} </span>
                  <span className="text-listbg"> : {review.content} </span>
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

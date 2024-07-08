import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import BasicLayout from '../../layout/BasicLayout';
import { useAuthStore } from '../../store/AuthStore';
import { useUserStore } from '../../store/UserStore';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuestionPage = () => {
  const [queryParams] = useSearchParams();
  const { user } = useAuthStore();
  const { id, replaceId } = useUserStore();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [content, setContent] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [productName, setproductName] = useState('');
  const [providerName, setproviderName] = useState('');
  const productId = queryParams.get('product');

  // 제품 정보 조회 함수
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

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title === '') {
      alert('제목을 입력해 주세요.');
      return;
    } else if (questionType === '') {
      alert('문의 유형을 선택해 주세요.');
      return;
    } else if (content === '') {
      alert('문의 내용을 입력해 주세요.');
      return;
    }
    try {
      const questionDate = new Date().toLocaleString();
      const questionData = {
        userID: replaceId(id),
        title,
        questionType,
        content,
        questionDate,
        productId,
        productName,
        providerName
      };
      await axios.post('/api/questions', {
        userId: id,
        questionData,
      }, {
        withCredentials: true,
      });
      alert('문의가 등록되었습니다.');
      navigate('/customer/question/list');
    } catch (error) {
      alert('문의를 등록하는데 에러가 발생했습니다:' + error.message);
      navigate('/customer/question/list');
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;
      try {
        const data = await getProductInfo(productId);
        if (!data)
          throw new Error();
        setproductName(data.pName);
        setproviderName(data.providerName);
      } catch (error) {
        alert('유효하지 않은 상품ID: ' + error.message);
        navigate(-1);
      }
    }
    fetchProductData();
  }, [productId]);

  if (!user || id == null) {
    return (
      <BasicLayout>
        <p className="pt-20 text-3xl text-baritem">로그인 후 이용하십시오.</p>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold mb-6 border-b text-sub">고객 문의</h1>
        <div className="text-sub font-bold mb-1">
          제품 ID: {productId}<br></br>제품명: {productName}<br></br>판매자ID: {providerName}
        </div>
        <div className="w-full">
          <form onSubmit={handleSubmit} className="bg-main border border-bor shadow-md rounded px-10 pt-8 pb-10 mb-6">
            <div className="mb-6">
              <label className="block text-sub font-bold mb-2" htmlFor="title">
                제목
              </label>
              <input
                className="shadow appearance-none bg-textbg border border-bor rounded w-full py-3 px-4 text-sub leading-tight focus:outline-none focus:shadow-outline"
                id="title"
                type="text"
                placeholder="제목을 입력해 주세요"
                value={title}
                onChange={handleTitleChange}
              />
            </div>
            <div className="mb-6 relative">
              <label className="block text-sub font-bold mb-2" htmlFor="questionType">
                문의 유형
              </label>
              <div className="relative">
                <div
                  className="shadow appearance-none bg-textbg border border-bor rounded w-full py-3 px-4 text-sub leading-tight focus:outline-none focus:shadow-outline cursor-pointer hover:bg-textbgHov transition-colors duration-300"
                  onClick={toggleDropdown}
                >
                  {questionType ? questionType : '선택해 주세요'}
                  <FontAwesomeIcon icon={faAngleDown} className="absolute right-4 top-1/2 transform -translate-y-1/2" />
                </div>
                {dropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-textbg border border-bor ring-black ring-opacity-5"
                  >
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <button
                        onClick={() => {
                          setQuestionType('상품 문의');
                          setDropdownOpen(false);
                        }}
                        className="block px-4 py-2 text-left text-sub bg-textbg hover:bg-textbgHov transition-colors duration-300 w-full"
                        role="menuitem"
                      >
                        상품 문의
                      </button>
                      <button
                        onClick={() => {
                          setQuestionType('배송 문의');
                          setDropdownOpen(false);
                        }}
                        className="block px-4 py-2 text-left text-sub bg-textbg hover:bg-textbgHov transition-colors duration-300 w-full"
                        role="menuitem"
                      >
                        배송 문의
                      </button>
                      <button
                        onClick={() => {
                          setQuestionType('환불 문의');
                          setDropdownOpen(false);
                        }}
                        className="block px-4 py-2 text-left text-sub bg-textbg hover:bg-textbgHov transition-colors duration-300 w-full"
                        role="menuitem"
                      >
                        환불 문의
                      </button>
                      <button
                        onClick={() => {
                          setQuestionType('기타 문의');
                          setDropdownOpen(false);
                        }}
                        className="block px-4 py-2 text-left text-sub bg-textbg hover:bg-textbgHov transition-colors duration-300 w-full"
                        role="menuitem"
                      >
                        기타 문의
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mb-8">
              <label className="block text-sub font-bold mb-2" htmlFor="content">
                문의 내용
              </label>
              <textarea
                className="shadow appearance-none border border-bor rounded w-full py-3 px-4 text-sub bg-textbg leading-tight focus:outline-none focus:shadow-outline h-40"
                id="content"
                placeholder="문의 내용을 입력해 주세요"
                value={content}
                onChange={handleContentChange}
              ></textarea>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-button2 hover:bg-button2Hov transition-colors duration-300 text-white font-bold py-3 px-5 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
                onClick={handleSubmit}
              >
                문의하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </BasicLayout>
  );
};

export default QuestionPage;

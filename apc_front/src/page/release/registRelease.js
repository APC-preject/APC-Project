import React, { useState, useEffect, useCallback, useRef } from 'react';
import BasicLayout from '../../layout/BasicLayout';
import LocationModal from '../../modal/LocationModal';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function MainPage() {
  const gradeSet = [1, 2, 3, 4, 5, 6, 7];
  const page_loc = useLocation();
  const [category, setCategory] = useState('');
  const [grade, setGrade] = useState({});
  const [quantity, setQuantity] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [remain, setRemain] = useState(gradeSet.reduce((acc, cur) => {
    acc[cur] = 0;
    return acc;
  }, {}));
  const [reserved, setReserved] = useState(page_loc.state ? page_loc.state.id : null);
  const navigate = useNavigate();

  useEffect(() => {
    for (let i of gradeSet) {
      setGrade({ ...grade, [i]: page_loc.state ? !!page_loc.state[i] : false });
      setQuantity({ ...quantity, [i]: page_loc.state ? page_loc.state[i] : 0 });
    }
    const pageLoading = async () => {

    };
    pageLoading();
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = async (data) => {
    if (!data) {
      setModalOpen(false);
      return;
    }
    try {
      const response = await fetch(`/api/stock/place/${data.x}/${data.y}`, {
        method: 'GET',
      })
      if (!response.ok) {
        throw new Error('network response Error');
      }
      const remainData = await response.json();
      console.log(remainData);
      setRemain(gradeSet.reduce((acc, cur) => {
        acc[cur] = remainData[cur] || 0;
        return acc;
      }, {}));
    } catch (error) {
      console.log(error);
    }
    setLocation(data);
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (category === '') {
      alert('품목을 입력해 주세요.');
      return;
    } else if (!gradeSet.some(e => grade[e])) {
      alert('등급을 선택해 주세요.');
      return;
    } else if (!gradeSet.some(e => quantity[e] != 0)) {
      alert('수량을 입력해 주세요.');
      return;
    } else if (location === null) {
      alert('위치를 입력해 주세요.');
      return;
    }
    try {
      if (gradeSet.filter(e => grade[e]).some(e => {
        return (parseInt(remain[e]) < parseInt(quantity[e]));
      })) {
        alert('현재 해당 위치의 재고보다 출고하려는 수량이 더 많습니다')
        throw new Error('network Error');
      }
      const send_data = {
        name: category,
        grade: grade,
        quantity: quantity,
        loc: location,
        reserved: reserved
      }
      const response = await fetch(`/api/release`, {
        method: 'POST',
        body: JSON.stringify(send_data),
        headers: {
          'Content-Type': 'application/json' // Content-Type 헤더 추가
        },
      });
      if (!response.ok) {
        throw new Error('network error');
      }
      alert(`출고 완료`);
      setCategory('');
      setGrade(gradeSet.reduce((acc, cur) => {
        acc[cur] = false;
        return acc;
      }, {}));
      setQuantity(gradeSet.reduce((acc, cur) => {
        acc[cur] = 0;
        return acc;
      }, {}))
      setLocation(null);
      navigate("/releaseData");
    } catch (error) {
      console.log(error);
      alert(`출고 실패`);
    }
  }

  const handleCategoryChange = async (e) => {
    setCategory(e.target.value)
  }

  const handleGradeChange = async (g) => {
    const newGrade = { ...grade, [g]: !grade[g] };
    setGrade(newGrade);
  }

  const handleQuantityChange = async (e, i) => {
    setQuantity({ ...quantity, [i]: e.target.value });
  }

  const ProductRank = ['1', '2', '3', '4', '5', '6', '7'];

  return (
    <BasicLayout>
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold mb-6 border-b text-sub">출고 등록</h1>
        {reserved &&
          <span className='text-sub px-5'>{`예약 상품의 출고입니다. 예약ID: ${reserved}`}</span>
        }
        <div className="w-full">
          <form onSubmit={handleSubmit} className="bg-main border border-bor shadow-md rounded px-10 pt-8 pb-10 mb-6">
            <div className="mb-6">
              <label className="block text-sub font-bold mb-2" htmlFor="category">
                출고 품목
              </label>
              <input
                className="shadow appearance-none bg-textbg border border-bor rounded w-full py-3 px-4 text-sub leading-tight focus:outline-none focus:shadow-outline"
                id="category"
                type="text"
                placeholder="품목을 입력해 주세요"
                value={category}
                onChange={handleCategoryChange}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sub font-bold mb-2" htmlFor="grade">
                출고 등급
              </label>
              {ProductRank.map((option) => (
                <button
                  key={option}
                  onClick={() => handleGradeChange(option)}
                  type="button"
                  className={`transition-colors duration-300 text-white py-1 px-5 rounded mx-3 ${!grade[option] ? 'bg-button3' : 'bg-button2'}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mb-3 mt-5">
              <label htmlFor="quantity" className="block text-sub font-bold mb-2" style={{ color: 'white' }}>출고 수량:</label>
              {!gradeSet.some(e => grade[e]) &&
                <div className="mb-3 mt-5">
                  <div className="text-lg text-sub mb-5">출고 등급을 선택해주세요</div>
                </div>
              }
              {gradeSet.filter(e => grade[e]).map((i) => (
                <div className="mb-3 mt-5">
                  <label htmlFor="quantity" className="text-lg mb-5" style={{ color: 'white' }}>{`${i}등급 출고 수량`} (kg):</label>
                  <input
                    type="number"
                    id="quantity"
                    min="0"
                    value={quantity[i]}
                    onChange={(e) => handleQuantityChange(e, i)}
                    className="w-20 px-2 py-1 ml-3 mb-5"
                  />
                </div>
              ))
              }

            </div>
            <div className="mb-6 flex">
              <div className="text-lg my-2 text-sub">
                <span className='block text-sub font-bold mb-2'>선택된 위치</span> {location ? `[ ${location.x}열 ${location.y}번 ]` : "not selected"}
                {location && (
                  <div className="text-lg my-2 text-sub">
                    {gradeSet.reduce((acc, cur) => {
                      acc += `${cur}:${remain[cur]} `;
                      return acc
                    }, '현재 재고 [ ') + "]"}
                  </div>
                )}
              </div>
              <button
                className="bg-button hover:bg-button2Hov transition-colors duration-300 text-white px-1 my-2 mx-3 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleOpenModal}
              >
                위치 선택
              </button>
              {isModalOpen && <LocationModal onClose={handleCloseModal} />}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-button2 hover:bg-button2Hov transition-colors duration-300 text-white font-bold py-3 px-5 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                출고
              </button>
            </div>
          </form>
        </div>
      </div>
    </BasicLayout>
  )
}
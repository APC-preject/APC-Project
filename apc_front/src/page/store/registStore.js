import React, { useState, useEffect, useCallback, useRef } from 'react';
import BasicLayout from '../../layout/BasicLayout';
import LocationModal from '../../modal/LocationModal';
import { useSearchParams, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';

export default function MainPage() {

  const [category, setCategory] = useState('토마토');
  const [viewCategory, setViewCategory] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [viewQuantity, setViewQuantity] = useState(0);
  const [productor, setProductor] = useState('');
  const [viewProductor, setViewProductor] = useState('');

  const [inputId, setInputId] = useState('');
  const [generate, setGenerate] = useState(false);
  const [dataToggle, setDataToggle] = useState(false);
  const [categoryToggle, setCategoryToggle] = useState(false);

  const navigate = useNavigate();

  async function checkGenerate(id) {
    console.log(id);
    if (id == '') return;
    try {
      const response = await fetch(`/api/store/generate/${id}`, {
        method: 'GET',
      })
      if (!response.ok) {
        throw new Error('network response Error');
      }
      const data = await response.json();
      console.log(data);
      setGenerate(data.generate);
      console.log("data fetched");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const pageLoading = async () => {

    };
    pageLoading();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => checkGenerate(inputId), 3000);

    return () => clearInterval(intervalId);
  }, [inputId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (category === '') {
      alert('품목을 입력해 주세요.');
      return;
    } else if (!productor) {
      alert('재배자를 입력해 주세요.');
      return;
    } else if (quantity === 0) {
      alert('수량을 입력해 주세요.');
      return;
    }

    try {
      const send_data = {
        productor: productor,
        name: category,
        quantity: quantity,
      }
      const response = await fetch(`/api/store`, {
        method: 'POST',
        body: JSON.stringify(send_data),
        headers: {
          'Content-Type': 'application/json' // Content-Type 헤더 추가
        },
      });
      if (!response.ok) {
        throw new Error('network error');
      }
      alert(`입고 완료`);
      setViewQuantity(quantity);
      setViewCategory(category);
      setViewProductor(productor);

      setProductor('');
      setQuantity(0);

      const res_data = await response.json();
      const id = res_data.id;
      const response_class = await fetch(`/api/store/${id}`, {
        method: 'PUT',
      });
      if (!response_class.ok) {
        throw new Error('network error');
      }
      if (id != '') {
        setInputId(id);
      }
    } catch (error) {
      console.log(error);
      alert(`입고 실패`);
    }
  }

  const handleMakeStoreForDebug = async (e) => {
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    e.preventDefault();
    const nameList = ["토마토", "사과", "파프리카"];
    const productList = ["토마토농장", "사과농장", "파프리카농장"];

    for (let i = 0; i < 5; i++) {
      const rand_val = Math.random();
      try {
        const send_data = {
          productor: productList[Math.floor(rand_val * 3)],
          name: nameList[Math.floor(rand_val * 3)],
          quantity: 20 + Math.floor(30 * Math.random()),
        }
        const response = await fetch(`/api/store`, {
          method: 'POST',
          body: JSON.stringify(send_data),
          headers: {
            'Content-Type': 'application/json' // Content-Type 헤더 추가
          },
        });
        if (!response.ok) {
          throw new Error('network error');
        }

        const res_data = await response.json();
        const id = res_data.id;
        const response_class = await fetch(`/api/store/${id}`, {
          method: 'PUT',
        });
        if (!response_class.ok) {
          throw new Error('network error');
        }
      } catch (error) {
        console.log(error);
        alert("?");
        break;
      }
    }
    alert(`입고 완료`);
  }

  const handleProductorChange = async (e) => {
    setProductor(e.target.value)
  }

  const handleQuantityChange = async (e) => {
    setQuantity(e.target.value);
  }

  const fruitCategory = ['토마토', '사과', '파프리카', '포도', '참다래', '딸기'];

  return (
    <BasicLayout>
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold mb-6 border-b text-sub">입고 등록</h1>
        <div className="w-full">
          <form onSubmit={/*handleMakeStoreForDebug*/handleSubmit} className="bg-main border border-bor shadow-md rounded px-10 pt-8 pb-10 mb-6">
            <div className="mb-6">
              <label className="block text-sub font-bold mb-2" htmlFor="category">
                입고 품목
              </label>
              <div className="flex items-center justify-between">
                <button
                  className="bg-button2 hover:bg-button2Hov transition-colors duration-300 text-white font-bold py-3 px-5 rounded focus:outline-none focus:shadow-outline w-full"
                  type="button"
                  onClick={() => { setCategoryToggle(!categoryToggle) }}
                >
                  {category}
                </button>
              </div>
              <ul>
                {categoryToggle && (fruitCategory.map(e => {
                  return (<li
                    className="cursor-pointer bg-button3 hover:bg-button2Hov transition-colors duration-300 text-white font-bold py-3 px-5 rounded focus:outline-none focus:shadow-outline w-full my-1"
                    onClick={() => {
                      setCategory(e)
                      setCategoryToggle(false);
                    }}>
                    {`${e}`}
                  </li>
                  )
                }))
                }
              </ul>
            </div>
            <div className="mb-6">
              <label className="block text-sub font-bold mb-2" htmlFor="productor">
                재배자
              </label>
              <input
                className="shadow appearance-none bg-textbg border border-bor rounded w-full py-3 px-4 text-sub leading-tight focus:outline-none focus:shadow-outline"
                id="productor"
                type="text"
                placeholder="재배자를 입력해 주세요"
                value={productor}
                onChange={handleProductorChange}
              />
            </div>
            <div className="mb-3 mt-5">
              <label htmlFor="quantity" className="block text-sub font-bold mb-2" style={{ color: 'white' }}>입고 수량 (kg):</label>
              <div className="mb-3 mt-5">
                <input
                  type="number"
                  id="quantity"
                  min="0"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-20 px-2 py-1 ml-3 mb-5"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-button2 hover:bg-button2Hov transition-colors duration-300 text-white font-bold py-3 px-5 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                입고
              </button>
            </div>

          </form>
        </div>
        <div className="flex items-center justify-between">
          {!(inputId != '') || !generate ? (
            <button
              className="bg-button3 transition-colors duration-300 text-white font-bold py-3 px-5 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => { }}
            >
              입고 확인
            </button>
          ) : (
            <button
              className={"hover:bg-button2Hov transition-colors duration-300 text-white font-bold py-3 px-5 rounded focus:outline-none focus:shadow-outline " + (dataToggle ? "bg-button" : "bg-button3")}
              type="button"
              onClick={() => { setDataToggle(!dataToggle) }}
            >
              입고 확인
            </button>
          )}

        </div>
        {dataToggle && inputId != '' && (!generate ? (
          <div className='w-full'>
            <h2 className="text-xl font-bold mb-6 text-sub">원물 데이터 받아오는 중</h2>
          </div>
        ) : (
          <div className='w-full'>
            <h2 className="text-xl font-bold mb-6 border-b text-sub">입고 확인(원물 사진)</h2>
            <div className='border-b'>
              <h3 className="text-l font-bold mb-6 text-sub">{`품목: ${viewCategory}`}</h3>
              <h3 className="text-l font-bold mb-6 text-sub">{`재배자: ${viewProductor}`}</h3>
              <h3 className="text-l font-bold mb-6 text-sub">{`수량: ${viewQuantity}`}</h3>
            </div>
            <div className='flex-col'>
              {Array.from({ length: Math.ceil(viewQuantity / 10) }, (_, i1) => i1).map(e1 => (
                <div className='flex'>
                  {Array.from({ length: viewQuantity - e1 * 10 >= 10 ? 10 : viewQuantity - e1 * 10 }, (_, i2) => e1 * 10 + i2).map(e2 => (
                    <div
                      className='flex bg-cover bg-center mt-5 justify-center'
                      style={{ width: '10%', height: 'auto', display: 'inline-block' }}
                    >
                      <img className='justify-center' src={`/generate/${inputId}/gen-${e2}.png`} style={{ width: '100%', height: 'auto' }} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-button2 hover:bg-button2Hov transition-colors duration-300 text-white font-bold py-3 px-5 rounded focus:outline-none focus:shadow-outline w-full"
                type="button"
                onClick={() => navigate("/storeData")}
              >
                확인
              </button>
            </div>
          </div>
        ))}
        {/* <iframe className='pt-15'
          title="WebGL App"
          src="/APC_GARAGE_fi/index.html"
          style={{ width: '100%', height: '800px', border: 'none' }}
        ></iframe> */}
      </div>
    </BasicLayout>
  )
}
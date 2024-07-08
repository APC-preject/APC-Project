import React, { useState, useEffect } from 'react';
import BasicLayout from '../layout/BasicLayout';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/products', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response error!');
        }
        const data = await response.json();
        const productList = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        productList.sort((a, b) => b.registerTime - a.registerTime);
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching product list:', error);
      }
    };

    fetchData();
  }, []);

  const currentProducts = products;

  const handleProductClick = (productId) => {
    navigate(`/product/detail?id=${productId}`);
  };

  return (
    <BasicLayout>
      <div className="flex-wrap bg-main">
        <div className="p-5 border-dashed rounded-lg border-gray-700 mt-14">
          <div className="max-w-[96rem] min-w-[18rem] mx-auto text-container">
            <div className="bg-cover bg-center" style={{ backgroundSize: 'contain', backgroundRepeat: 'no-repeat', height: 800, backgroundImage: 'url(/assets/videocutcut.gif)' }}>
            </div>
            <div className='flex flex-col items-center p-6 rounded-lg w-full mt-5 mb-5'>
              <h2 className='text-4xl font-bold mb-8 text-sub'>
                ★ 신상품 ★
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {currentProducts.slice(0, 4).map((product) => (
                  <div
                    key={product.id}
                    className="bg-textbg shadow-md rounded-lg p-4 cursor-pointer hover:bg-gray-500 transition-colors duration-500"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img
                      src={product.pImageUrl}
                      alt={product.name}
                      className="w-full h-80 object-cover mb-4"
                    />
                    <h2 className="text-lg font-semibold mb-2 text-sub">{product.pName}</h2>
                    <p className="text-sub text-lg">가격: {product.pPrice}원/kg</p>
                  </div>
                ))}
              </div>
            </div>
            <div className='flex flex-col items-center p-6 rounded-lg w-full mt-5 mb-5'>
              <h2 className='text-4xl font-bold mb-8 text-sub'>
                ★ 인기상품 ★
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {currentProducts.filter(product => (
                  product.pName === "파프리카" || product.pName === "참다래" || product.pName === "토마토" || product.pName === "딸기"
                )).map((product, index) => (
                  <div
                    key={product.id}
                    className="bg-textbg shadow-md rounded-lg p-4 cursor-pointer hover:bg-gray-500 transition-colors duration-500"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <div style={{
                        position: 'absolute',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        color: '#000000',
                        padding: '10px 20px',
                        borderRadius: '3px',
                        fontSize: '22px',
                        fontWeight: 'bold'
                      }}>
                        {index === 0 ? (index + 1) + "st" : index === 1 ? (index + 1) + "nd" : index === 2 ? (index + 1) + "rd" : (index + 1) + "th"}
                      </div>
                      <img
                        src={product.pImageUrl}
                        alt={product.name}
                        className="w-full h-80 object-cover mb-4"
                      />
                    </div>
                    <h2 className="text-lg font-semibold mb-2 text-sub">{product.pName}</h2>
                    <p className="text-sub text-lg">가격: {product.pPrice}원/kg</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BasicLayout>
  )
}

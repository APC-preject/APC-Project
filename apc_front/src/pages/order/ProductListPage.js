import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import BasicLayout from '../../layout/BasicLayout';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import { getDatabase, databaseRef, get } from '../../firebase/FirebaseInstance'

  const ProductList = () => {
  
    
  const [currentPage, setCurrentPage] = useState(0);
  const [products, setProducts] = useState([]);
  const productsPerPage = 9;
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/products', {
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

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * productsPerPage;
  const currentProducts = products.slice(offset, offset + productsPerPage);

  const handleProductClick = (productId) => {
    navigate(`/product/detail?id=${productId}`);
  };

  const pageCount = Math.ceil(products.length / productsPerPage); // pageCount 변수 추가

  
  return (
    <BasicLayout>
      <div className="container mx-auto px-4  py-20">
        <h1 className="text-2xl font-bold mb-4 text-sub border-b">상품 목록</h1>
        <div className="grid grid-cols-3 gap-4 ">
          {currentProducts.map((product) => (
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
              <p className="text-sub">가격: {product.pPrice}원/kg</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8 text-sub">
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'flex items-center'}
            activeClassName={'bg-button2 text-white'}
            pageClassName={'mx-2'}
            pageLinkClassName={'px-3 py-2 rounded-md hover:bg-hov transition-colors duration-300'}
            previousClassName={'mx-2'}
            previousLinkClassName={'px-3 py-2 rounded-md hover:bg-hov transition-colors duration-300'}
            nextClassName={'mx-2'}
            nextLinkClassName={'px-3 py-2 rounded-md hover:bg-hov transition-colors duration-300'}
          />
        </div>
      </div>
    </BasicLayout>
  );
};

export default ProductList;
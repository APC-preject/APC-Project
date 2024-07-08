import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicLayout from '../../layout/BasicLayout';
import { useAuthStore } from '../../store/AuthStore';
import { useUserStore } from '../../store/UserStore';

function ProductRegisterPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const { id, role, replaceId } = useUserStore();

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

  const handleImageFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const updateUserProductData = async (userId, productName) => {
    try {
      const response = await fetch(`/api/products/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName: productName }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update user product data.');
      }
    } catch (error) {
      console.error('Error updating user product data:', error);
    }
  };

  const handleSubmit = async () => {
    const providerId = id;
    const currentTime = new Date();

    const productData = {
      providerName: providerId,
      pName: productName,
      pPrice: price,
      pQuantity: quantity,
      pDescription: description,
      pImageUrl: '',
      registerTime: currentTime.getTime(),
    };

    const uploadDB = async (product_data) => {
      try {
        const response = await fetch(`/api/products`, {
          method: 'POST',
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
        const { key } = await response.json();
        alert('데이터베이스 저장 완료.');
        await updateUserProductData(providerId, key);
        navigate('/product/list');
      } catch (error) {
        alert('데이터베이스 저장 실패.');
        console.error('Error adding product:', error);
      }
    }

    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`/api/products/image/${imageFile.name}`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response error!');
        }
        const url = await response.json();
        productData.pImageUrl = url['url'];
        await uploadDB(productData);
      } catch (error) {
        console.error('Error getting download URL:', error);
      }
    } else {
      await uploadDB(productData);
    }
  };

  if (!user || id == null || role != 1) {
    return (
      <BasicLayout>
        <p className="pt-20 text-3xl text-baritem">판매자 계정으로 로그인 후 이용하십시오.</p>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold mb-6 text-sub border-b border-sub">
          상품 등록
        </h1>
        <div className="bg-main shadow-md rounded-lg p-6 border border-bor">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-sub">판매자ID</h2>
            <p className="text-sub">{replaceId(id)}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-sub">상품명</h2>
            <input
              className="w-full px-3 py-2 text-sub border border-bor rounded-lg focus:outline-none focus:border-blue-500 bg-textbg"
              type="text"
              placeholder="상품명을 입력해주세요."
              value={productName}
              onChange={handleProductNameChange}
            />
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-sub">가격(원) / kg</h2>
            <input
              className="w-full px-3 py-2 text-sub border border-bor rounded-lg focus:outline-none focus:border-blue-500 bg-textbg"
              type="number"
              placeholder="가격을 입력해주세요."
              value={price}
              onChange={handlePriceChange}
            />
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-sub">수량 (kg)</h2>
            <input
              className="w-full px-3 py-2 text-sub border border-bor rounded-lg focus:outline-none focus:border-blue-500 bg-textbg"
              type="number"
              placeholder="수량을 입력해주세요."
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-sub">상품 설명</h2>
            <textarea
              className="w-full px-3 py-2 text-sub border border-bor rounded-lg focus:outline-none focus:border-blue-500 bg-textbg"
              rows="4"
              placeholder="상품에 대한 설명을 입력해주세요."
              value={description}
              onChange={handleDescriptionChange}
            ></textarea>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 text-sub">이미지 파일</h2>
            <div className="flex items-center">
              <input
                id="fileInput"
                className="hidden"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
              />
              <label
                htmlFor="fileInput"
                className="bg-button2 hover:bg-button2Hov text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
              >
                파일 선택
              </label>
              {imageFile && <span className="ml-2 text-sub">{imageFile.name}</span>}
            </div>
          </div>
          <button
            className="bg-button2 hover:bg-button2Hov mt-8 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none"
            onClick={handleSubmit}
          >
            등록
          </button>
        </div>
      </div>
    </BasicLayout>
  );
}

export default ProductRegisterPage;

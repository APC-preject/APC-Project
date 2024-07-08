import React, { useState, useEffect, useCallback } from 'react';
import BasicLayout from '../../layout/BasicLayout';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/UserStore';

const PurchasePage = () => {
    const [queryParams] = useSearchParams();
    const productId = queryParams.get('id');
    const { id } = useUserStore();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [roadAddress, setRoadAddress] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [provider_Name, setProvider_Name] = useState('');
    const [leftQuantity, setLeftQuantity] = useState(0);
    const [providerName, setProviderName] = useState('');

    // 제품 목록으로 네비게이트
    const handleNavigateProductList = useCallback(() => {
        navigate({ pathname: '/product/list' });
    }, [navigate]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const response = await fetch(`/api/products/${productId}`, {
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Network response error!');
                }
                const data = await response.json();
                setProduct(data);
                setTotalPrice(data.pPrice);
                setLeftQuantity(data.pQuantity);
                setProvider_Name(data.providerName.replace(".", "_"));
                setProviderName(data.providerName);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProductData();
    }, [productId]);

    const handleQuantityChange = (e) => {
        const qty = parseInt(e.target.value);
        setQuantity(qty);
        setTotalPrice(qty * product.pPrice);
    };
    // 도로명 주소 입력 변화
    const handleRoadAddressChange = (e) => {
        setRoadAddress(e.target.value);
    };

    // 상세 주소 입력 변화
    const handleDetailAddressChange = (e) => {
        setDetailAddress(e.target.value);
    };

    // 모달에서 확인을 눌렀을 때 실제 주문 처리
    const handleConfirmOrder = async () => {
        const productName = product.pName;
        const orderedPrice = product.pPrice * quantity;
        const orderedProductId = productId;

        const newOrder = {
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
            productName: productName,
            deliveryStatus: 0
        };

        const send_data = {
            newOrder: newOrder,
            newDeliveryWait: newDeliveryWait,
            id: id,
            productId: productId,
            quantity: quantity,
            provider_Name: provider_Name,
            orderedPrice: orderedPrice
        }

        try {
            const response = await fetch(`/api/orders`, {
                method: 'POST',
                body: JSON.stringify(send_data),
                headers: {
                    'Content-Type': 'application/json' // Content-Type 헤더 추가
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(response.json().message);
            }
            alert(`총 ${quantity}kg 주문하셨습니다. 가격은 ${orderedPrice}원 입니다.`);
            handleNavigateProductList();
        } catch (error) {
            alert('주문 처리 중 문제가 발생했습니다');
            return;
        }
    };

    if (!product) {
        return <div style={{ color: 'white' }}>Loading...</div>;
    }

    return (
        <BasicLayout>
            <div className="container mx-auto py-20 px-4">
                <h1 className="text-2xl font-bold mb-8" style={{ color: 'white' }}>구매 페이지</h1>
                <hr className="border-t border-white mb-8" />
                <div className="flex justify-center items-center">
                    <div className="w-1/2 p-4"> {/* Add padding here */}
                        <img src={product.pImageUrl} alt={product.pName} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-1/2 flex flex-col items-start p-10 ml-6">
                        <div className="flex-grow">
                            <h2 className="text-3xl font-bold mb-10" style={{ color: 'white' }}>{product.pName}</h2>
                            <p className="text-lg mb-5" style={{ color: 'white' }}>가격: {product.pPrice}원/kg</p>
                            <p className="text-lg mb-5" style={{ color: 'white' }}>남은 수량: {product.pQuantity}kg</p>
                            <label htmlFor="quantity" className="text-lg mb-5" style={{ color: 'white' }}>수량 (kg):</label>
                            <input
                                type="number"
                                id="quantity"
                                min="1"
                                value={quantity}
                                onChange={handleQuantityChange}
                                className="w-20 px-2 py-1 ml-3 mb-5"
                            />
                            <p className="text-lg font-bold mb-5" style={{ color: 'white' }}>총액: {totalPrice}원</p>
                            <div className="flex flex-col items-start text-lg text-sub mb-5">
                                <label htmlFor="roadAddress" className="mb-2">도로명 주소:</label>
                                <input
                                    type="text"
                                    id="roadAddress"
                                    value={roadAddress}
                                    onChange={handleRoadAddressChange}
                                    className="w-full px-2 py-1 bg-textbg border border-gray-500 text-sub rounded"
                                />
                            </div>
                            <div className="flex flex-col items-start text-lg text-sub mb-5">
                                <label htmlFor="detailAddress" className="mb-2">상세 주소:</label>
                                <input
                                    type="text"
                                    id="detailAddress"
                                    value={detailAddress}
                                    onChange={handleDetailAddressChange}
                                    className="w-full px-2 py-1 bg-textbg border border-gray-500 text-sub rounded"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleConfirmOrder}
                            className="bg-blue-500 mt-20 hover:bg-blue-700 text-white px-8 py-4 rounded text-2xl mr-10"
                            style={{ alignSelf: 'flex-end' }}
                        >구매
                        </button>
                    </div>
                </div>
            </div>
        </BasicLayout>
    );
};

export default PurchasePage;

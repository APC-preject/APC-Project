import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../FirebaseInstance';
import './Main.css';

const ITEMS_PER_PAGE = 2;

const Main = () => {
  const [fruitData, setFruitData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userUid = user.uid;
        const userRef = ref(database, `users/${userUid}`);

        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            const userName = userData.name;

            const storeRef = ref(database, `store`);
            const storeQuery = query(storeRef, orderByChild('productor'), equalTo(userName));

            onValue(storeQuery, (snapshot) => {
              const storeData = snapshot.val();
              if (storeData) {
                const fruitArray = Object.keys(storeData).map((key) => ({
                  id: key,
                  ...storeData[key],
                }));
                setFruitData(fruitArray);
              }
            });
          }
        });
      } else {
        window.location.href = '/producer/signin';
      }
    });

    return () => unsubscribe();
  }, []);

  const calculateRevenue = (quantity) => {
    return (quantity[1] * 3500) + (quantity[2] * 3000) + (quantity[3] * 2500) + (quantity[4] * 2000) + (quantity[5] * 1500) + (quantity[6] * 1000) + (quantity[7] * 500);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(fruitData.length / ITEMS_PER_PAGE);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const selectedFruits = fruitData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="container main-container">
      <h1>메인 화면</h1>
      {selectedFruits.length === 0 ? (
        <p>과일 정보를 찾을 수 없습니다.</p>
      ) : (
        selectedFruits.map((fruit) => (
          <div key={fruit.id} className="fruit-info">
            <div className="fruit-details">
              <h2>현재 내 과일 상태: {fruit.classification ? '선별 완료' : '미선별'}</h2>
              {fruit.classification ? (
                <div className="quality-result">
                  <h2>품질 선별 결과:</h2>
                  <h3>1 등급: {fruit.quantity[1]}개</h3>
                  <h3>2 등급: {fruit.quantity[2]}개</h3>
                  <h3>3 등급: {fruit.quantity[3]}개</h3>
                  <h3>4 등급: {fruit.quantity[4]}개</h3>
                  <h3>5 등급: {fruit.quantity[5]}개</h3>
                  <h3>6 등급: {fruit.quantity[6]}개</h3>
                  <h3>7 등급: {fruit.quantity[7]}개</h3>
                  <h2>총 수익: {calculateRevenue(fruit.quantity)}원</h2>
                </div>
              ) : (
                <h3>총 과일 개수: {fruit.quantity}</h3>
              )}
            </div>
          </div>
        ))
      )}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          이전
        </button>
        <span>{currentPage}</span>
        <button onClick={handleNextPage} disabled={currentPage * ITEMS_PER_PAGE >= fruitData.length}>
          다음
        </button>
      </div>
    </div>
  );
};

export default Main;

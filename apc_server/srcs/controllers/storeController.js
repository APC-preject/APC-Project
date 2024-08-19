const axios = require('axios');
const jwt = require('jsonwebtoken');
const firebase = require('../../firebase');
const dotenv = require('dotenv');

dotenv.config({ path: './secrets/.env' }); // .env 파일에서 환경변수 로드

const db = firebase.db; // firebase database 초기화

const {
    // firebase config
    API_KEY,
    JWT_SECRET
} = process.env; // 환경변수 가져오기

async function addStore (req, res) {
  const {productor, name, quantity, loc} = req.body;
  const storeRef = db.ref(`store`);

  try{
    const updates = {};
    const newStoreRef = storeRef.push();
    const storeId = newStoreRef.key;
    
    updates[`store/${storeId}`] = {
      productor, name, quantity, 
      total: quantity,
      loc: {
        ...loc, z: 0
      },
      date: new Date().toLocaleString('ko-KR', { // 도착일 생성(현재 시간)
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,    // 24시간 형식 사용
        timeZone: 'Asia/Seoul'    // 한국 표준시 (KST)
      }),
      classification: false,
      generation: false,
      class_start: false,
      class_complete: false,
    }

    await db.ref().update(updates);
    res.status(200).json({ message: 'complete', id: storeId });
  } catch (error) {
    res.status(500).json({ message: '입고 오류' });
  }
}

async function storeClassification(req, res) {
  const id = req.params.id;

  const storeRef = db.ref(`store/${id}`);
  const stockRef = db.ref(`stock`);

  try{
    const updates = {};

    const curStore = (await storeRef.get()).val();
    const curStock = (await stockRef.get()).val();

    const total = curStore.quantity;

    const class_2 = Math.floor(total * Math.random() * 0.142);
    const class_3 = Math.floor(total * Math.random() * 0.142);
    const class_4 = Math.floor(total * Math.random() * 0.142);
    const class_5 = Math.floor(total * Math.random() * 0.142);
    const class_6 = Math.floor(total * Math.random() * 0.142);
    const class_7 = Math.floor(total * Math.random() * 0.142);
    const class_1 = total - class_2 - class_3 - class_4 - class_5 - class_6 - class_7;
    const quantity = {
      1: class_1, 
      2: class_2, 
      3: class_3, 
      4: class_4, 
      5: class_5, 
      6: class_6, 
      7: class_7, 
    };
    let unity_quantity = "";
    for (let i in quantity) {
      unity_quantity += `${quantity[i]}$`
    }

    updates[`store/${id}`] = {
      ...curStore,
      quantity: quantity,
      unity_quantity: unity_quantity
    };

    const newStock = {...curStock}
    Object.keys(quantity).forEach((k) => {
      if (curStock && curStock[k]) {
        newStock[k] = parseInt(curStock[k]) + parseInt(quantity[k]);
      } else {
        newStock[k] = parseInt(quantity[k]);
      }
    })

    updates[`stock`] = newStock;
    updates[`stockTime/${new Date().getTime()}`] = {
      ... quantity, 
      name: curStore.name
    }

    await db.ref().update(updates);
    res.status(200).json({ message: 'complete' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: '선별 오류' });
  }
}

async function storeClassificationTrue(req, res) {
  const id = req.params.id;

  const storeRef = db.ref(`store/${id}`);

  try{
    const updates = {};

    const curStore = (await storeRef.get()).val();

    updates[`store/${id}`] = {
      ...curStore,
      classification: true
    };

    await db.ref().update(updates);
    res.status(200).json({ message: 'complete' });
  } catch (error) {
    res.status(500).json({ message: '선별 오류' });
  }
}

async function getStoreList(req, res) {
  const storeRef = db.ref(`store`);
  try {
    const snapshot = await storeRef.get();
    res.status(200).json(
      snapshot.exists() ? snapshot.val() : {}
    );
  } catch (error) {
    res.status(500).json({ message: 'Error fetching store', error });
  }
}

async function getStoreCheckGenerate(req, res) {
  const id = req.params.id;
  const storeRef = db.ref(`store/${id}`);
  try {
    const snapshot = await storeRef.get();
    if (snapshot.exists()) {
      const data = snapshot.val();
      res.status(200).json(
        {generate: data.generation}
      );
      return ;
    }
    res.status(200).json(
      {generate: false}
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching store', error });
  }
}

module.exports = {
  addStore, getStoreList, storeClassification, storeClassificationTrue, getStoreCheckGenerate
};
const axios = require('axios');
const jwt = require('jsonwebtoken');
const firebase = require('../../firebase');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' }); // .env 파일에서 환경변수 로드

const db = firebase.db; // firebase database 초기화

const {
  // firebase config
  API_KEY,
  JWT_SECRET
} = process.env; // 환경변수 가져오기

async function addRelease(req, res) {
  const { name, grade, quantity, loc, reserved } = req.body;
  const releaseRef = db.ref(`release`);
  const stockRef = db.ref(`stock`);
  const storageRef = db.ref(`UNITY_DB/storage/APC1/1/place/${loc.x}/${loc.y}`);
  const stockTimeRef = db.ref(`stockTime`);

  try {
    const updates = {};
    const newReleaseRef = releaseRef.push();
    const releaseId = newReleaseRef.key;

    const curStock = (await stockRef.get()).val();
    const curStorage = (await storageRef.get()).val();

    const nowTime = new Date().toLocaleString('ko-KR', { // 도착일 생성(현재 시간)
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,    // 24시간 형식 사용
      timeZone: 'Asia/Seoul'    // 한국 표준시 (KST)
    });
    updates[`release/${releaseId}`] = {
      name, quantity, 
      loc: {
        ...loc, z: 0
      },
      date: nowTime,
      LogisticsInfo: [null, {
        level: 1,
        location: "APC",
        state: "출고",
        time: nowTime,
        environment: {
          temp: 8 + Math.random() * 2,
          humidity: 40 + Math.random() * 10,
          ethylene: Math.random()
        },
        truck: `${Math.floor(Math.random() * 989 + 11)}${['바', '사', '아', '자'][Math.floor(Math.random() * 4)]} ${Math.floor(Math.random() * 8998 + 1001)}`
      }]
    }

    const newStorage = { ...curStorage }
    const newStock = { ...curStock }
    const items = Object.keys(quantity);
    items.forEach((k) => {
      if (curStorage[k] && parseInt(curStorage[k]) >= parseInt(quantity[k])) {
        newStorage[k] = `${parseInt(curStorage[k]) - parseInt(quantity[k])}`;
      } else {
        throw new Error('lack stock');
      }
      if (curStock[k] && parseInt(curStock[k]) >= parseInt(quantity[k])) {
        newStock[k] = parseInt(curStock[k]) - parseInt(quantity[k]);
      } else {
        throw new Error('lack stock');
      }
    })

    const stockTimeObj = (await stockTimeRef.get()).val();
    const stockTime = Object.keys(stockTimeObj);

    items.forEach((i) => {
      let total = parseInt(quantity[i]);
      for (k of stockTime) {
        let intStock = parseInt(stockTimeObj[k][i]);
        if (intStock && intStock !== NaN) {
          if (intStock <= total) {
            delete stockTimeObj[k][i];
            if (Object.keys(stockTimeObj[k]) === 0)
              delete stockTimeObj[k];
          } else {
            stockTimeObj[k][i] = intStock - total;
          }
          total -= intStock;
        }
        if (total <= 0) continue;
      }
    });

    updates[`UNITY_DB/storage/APC1/1/place/${loc.x}/${loc.y}`] = newStorage;
    updates[`stock`] = newStock;
    updates[`stockTime`] = stockTimeObj;

    if (reserved) {
      const reserveRef = db.ref(`reservations/${reserved}`);
      await reserveRef.remove();
    }
    await db.ref().update(updates);
    res.status(200).json({ message: 'complete' });
  } catch (error) {
    res.status(500).json({ message: '출고 오류' });
  }
}

async function getReleaseList(req, res) {
  const releaseRef = db.ref(`release`);
  try {
    const snapshot = await releaseRef.get();
    res.status(200).json(
      snapshot.exists() ? snapshot.val() : {}
    );
  } catch (error) {
    res.status(500).json({ message: 'Error fetching release', error });
  }
}

module.exports = {
  addRelease, getReleaseList
};

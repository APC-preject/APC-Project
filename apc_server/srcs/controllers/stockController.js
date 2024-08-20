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

async function getReserveList(req, res) {
  const reservelistRef = db.ref(`reservations`);
  try {
    const snapshot = await reservelistRef.get();
    res.status(200).json(
      snapshot.exists() ? snapshot.val() : {}
    );
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reserve', error });
  }
}

async function getPlaceRemain(req, res) {
  const { x, y } = req.params;
  const placeRef = db.ref(`UNITY_DB/storage/APC1/1/place/${x}/${y}`);
  try {
    const snapshot = await placeRef.get();
    res.status(200).json(
      snapshot.exists() ? snapshot.val() : {}
    );
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reserve', error });
  }
}

async function acceptReserve(req, res) {
  const id = req.params.id;
  const reservelistRef = db.ref(`reservations/${id}`);
  try {
    const update = { accept: 1 };
    await reservelistRef.update(update);
    res.status(200).json({ message: 'accept complete ' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reserve', error });
  }
}

async function rejectReserve(req, res) {
  const id = req.params.id;
  const reservelistRef = db.ref(`reservations/${id}`);
  try {
    const update = { accept: 2 };
    await reservelistRef.update(update);
    res.status(200).json({ message: 'reject complete ' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reserve', error });
  }
}

async function getStockTimeList(req, res) {
  const reservelistRef = db.ref(`stockTime`);
  try {
    const snapshot = await reservelistRef.get();
    res.status(200).json(
      snapshot.exists() ? snapshot.val() : {}
    );
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reserve', error });
  }
}

async function setStockPlace(req, res) {
  const { x, y } = req.body;
  const time = req.params.time;

  const timelistRef = db.ref(`stockTime/${time}`);
  const storageRef = db.ref(`UNITY_DB/storage/APC1/1/place/${x}/${y}`);
  const curStorage = (await storageRef.get()).val();
  const timelistData = (await timelistRef.get()).val();

  try {
    const updates = {};
    updates[`stockTime/${time}/place`] = { x, y };

    const newStorage = { ...curStorage }
    Object.keys(timelistData).forEach((k) => {
      if (curStorage[k]) {
        newStorage[k] = `${parseInt(curStorage[k]) + parseInt(timelistData[k])}`;
      } else {
        newStorage[k] = `${parseInt(timelistData[k])}`;
      }
    })
    updates[`UNITY_DB/storage/APC1/1/place/${x}/${y}`] = newStorage;

    await db.ref().update(updates);
    res.status(200).json({ message: 'complete' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching reserve', error });
  }
}

module.exports = {
  getReserveList, acceptReserve, rejectReserve, getPlaceRemain, getStockTimeList, setStockPlace
};


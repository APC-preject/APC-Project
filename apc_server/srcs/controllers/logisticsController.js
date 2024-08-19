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


async function getLogisticsList(req, res) {
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

async function updateLogisticsInfo(req, res) {
  const releaseId = req.params.releaseId;
  const releaseRef = db.ref(`release/${releaseId}`);
  const nowTime = new Date().toLocaleString('ko-KR', { // 도착일 생성(현재 시간)
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,    // 24시간 형식 사용
    timeZone: 'Asia/Seoul'    // 한국 표준시 (KST)
  });

  try {
    const updates = {};
    const updateData = (await releaseRef.get()).val();

    let newDetail = {};
    if (updateData.LogisticsInfo.length === 9) {
      res.status(200).json({ message: 'complete' });
      return;
    }
    const truck = `${Math.floor(Math.random() * 999 + 1)}${['바', '사', '아', '자'][Math.floor(Math.random() * 4)]} ${Math.floor(Math.random() * 9999 + 1)}`;
    switch (updateData.LogisticsInfo.length - 1) {
      case 1:
        newDetail = {
          level: 2,
          location: "ES 물류창고",
          state: "집화처리",
          truck: updateData.LogisticsInfo[1].truck
        }
        break;
      case 2:
        newDetail = {
          level: 2,
          location: "ES 물류창고",
          state: "간선상차",
          truck: truck
        }
        break;
      case 3:
        newDetail = {
          level: 3,
          location: "곤지암 HUB",
          state: "간선하차",
          truck: updateData.LogisticsInfo[3].truck
        }
        break;
      case 4:
        newDetail = {
          level: 3,
          location: "곤지암 HUB",
          state: "간선상차",
          truck: truck
        }
        break;
      case 5:
        newDetail = {
          level: 4,
          location: "서울우체국",
          state: "간선하차",
          truck: updateData.LogisticsInfo[5].truck
        }
        break;
      case 6:
        newDetail = {
          level: 4,
          location: "서울우체국",
          state: "배송상차",
          truck: truck
        }
        break;
      case 7:
        newDetail = {
          level: 5,
          location: "배송지",
          state: "배송완료",
          truck: updateData.LogisticsInfo[7].truck
        }
        break;
      default:
        break;
    }

    newDetail = {
      ...newDetail,
      time: nowTime,
      environment: {
        temp: 8 + Math.random() * 2,
        humidity: 40 + Math.random() * 10,
        ethylene: Math.random()
      }
    }
    updateData.LogisticsInfo.push(newDetail);
    updates[`release/${releaseId}`] = updateData;
    await db.ref().update(updates);
    res.status(200).json({ message: 'complete' });
  } catch (error) {
    res.status(500).json({ message: '업데이트 오류' });
  }
}

module.exports = {
  getLogisticsList, updateLogisticsInfo
};

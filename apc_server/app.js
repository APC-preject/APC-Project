const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rootRouter = require('./srcs/routes/root-routes');
const dotenv = require('dotenv');

dotenv.config({ path: './secrets/.env' }); // .env 파일에서 환경변수 로드

const {
    // server config
    PORT,
    HOST,
    FRONT_ORIGIN_URL,
    NGROK_URL,
} = process.env; // 환경변수 가져오기

const app = express(); // express 서버 생성

const corsOptions = {
    origin: [FRONT_ORIGIN_URL, NGROK_URL], // 클라이언트 도메인
    credentials: true, // 쿠키 전달 허용
}; // cors 옵션

app.use(cors(corsOptions)); // cors 미들웨어
app.use(express.json()); // json 파싱 미들웨어
app.use(express.urlencoded({ extended: true })); // urlencoded 파싱 미들웨어
app.use(cookieParser()); // 쿠키 파싱 미들웨어

app.use('/api', rootRouter.router); // 루트 라우터 등록

app.listen(PORT, () => { // 서버 실행
  console.log(`Server is running on http://${HOST}:${PORT}`);
});


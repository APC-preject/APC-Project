const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rootRouter = require('./srcs/routes/root-routes');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' }); // .env 파일에서 환경변수 로드

const {
    // server config
    PORT,
    FRONT_PORT,
    NGROK_URL,
} = process.env; // 환경변수 가져오기

if (NGROK_URL === undefined) { // NGROK_URL이 정의되지 않았을 때
    console.error('NGROK_URL is not defined');
    process.exit(1);
}

const app = express(); // express 서버 생성

const corsOptions = {
    origin: [`http://localhost:${FRONT_PORT}`, NGROK_URL], // 클라이언트 도메인
    credentials: true, // 쿠키 전달 허용
}; // cors 옵션

app.use(cors(corsOptions)); // cors 미들웨어
app.use(express.json()); // json 파싱 미들웨어
app.use(express.urlencoded({ extended: true })); // urlencoded 파싱 미들웨어
app.use(cookieParser()); // 쿠키 파싱 미들웨어

app.use('/api', rootRouter.router); // 루트 라우터 등록

app.listen(PORT, () => { // 서버 실행
  console.log(`Server is running on http://localhost:${PORT}`);
});


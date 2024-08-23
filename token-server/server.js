const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const {
  // server config
  PORT
} = process.env;

const app = express();
const port = PORT;

app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY; // 비밀 키
const ALGORITHM = 'aes-256-cbc'; // 암호화 알고리즘

// 암호화 함수
const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'base64'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
};

// 복호화 함수
const decrypt = (text) => {
  const [iv, encryptedText] = text.split(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'base64'), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// 토큰 생성 API
app.post('/token/login', (req, res) => {
  const { customer } = req.body;
  if (!customer) {
    return res.status(400).send('Customer is required');
  }

  const token = encrypt(customer);
  res.send({ token });
});

// 토큰 검증 API
app.post('/token/verify', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).send('Token is required');
  }

  try {
    const customer = decrypt(token);
    res.send({ customer });
  } catch (error) {
    res.status(401).send('Invalid token');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

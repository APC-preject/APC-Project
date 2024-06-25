const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const adminKey = require('./unity-apc-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(adminKey),
  databaseURL: 'https://unity-apc-default-rtdb.firebaseio.com/'
});

const db = admin.database();
const app = express();
const port = 4001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// 유저 문의 리스트 가져오기
app.get('/userQuestions/:userId', async (req, res) => {
  const userId = req.params.userId;
  const ref = db.ref(`userQuestions/${userId}`);
  try {
    const snapshot = await ref.once('value');
    if(snapshot.exists()) {
      res.status(200).send(snapshot.val());
    } else {
      res.status(404).send('No data available');
    }
  } catch(error) {
    res.status(500).send(error.message);
  }
});

// 전체 문의 리스트 가져오기
app.get('/questions', async (req, res) => {
  const ref = db.ref('questions');
  try {
    const snapshot = await ref.once('value');
    if (snapshot.exists()) {
      res.status(200).send(snapshot.val());
    } else {
      res.status(404).send('No data available');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 특정 문의 가져오기
app.get('/questions/:questionId', async (req, res) => {
  const questionId = req.params.questionId;
  const ref = db.ref(`questions/${questionId}`);
  try {
    const snapshot = await ref.once('value');
    if (snapshot.exists()) {
      res.status(200).send(snapshot.val());
    } else {
      res.status(404).send('No data available');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 문의 작성
app.post('/questions', async (req, res) => {
  const { userId, questionData } = req.body;
  const newQuestionRef = db.ref('questions').push();
  try {
    await newQuestionRef.set(questionData);
    await db.ref(`userQuestions/${userId}/${newQuestionRef.key}`).set(questionData);
    res.status(201).send('Question created successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// 문의 답변
app.post('/questions/:questionId/response', async (req, res) => {
  const questionId = req.params.questionId;
  const { response } = req.body;
  try {
    await db.ref(`questions/${questionId}/response`).set(response);
    res.status(200).send('Response submitted successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

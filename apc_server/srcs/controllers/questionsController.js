const firebase = require('../../firebase');

const db = firebase.db; // firebase database 초기화


async function getQuestionList(req, res) {
    const ref = db.ref('questions'); // 전체 문의 레퍼런스
    try {
        const snapshot = await ref.once('value'); // 전체 문의 리스트 가져오기
        if (snapshot.exists()) { // 전체 문의 리스트가 있을 시
            res.status(200).send(snapshot.val());
        } else { // 전체 문의 리스트가 없을 시
            res.status(404).send('No data available');
        }
    } catch (error) { // 전체 문의 리스트 가져오기 실패 시
        res.status(500).send(error.message);
    }
}

async function registQuestion(req, res) {
    const { userId, questionData } = req.body; // userId, questionData 추출
    const newQuestionRef = db.ref('questions').push(); // 새로운 문의 레퍼런스 생성
    try {
        await newQuestionRef.set(questionData); // 새로운 문의 저장
        await db.ref(`userQuestions/${userId}/${newQuestionRef.key}`).set(questionData); // 유저 문의 저장
        await db.ref(`userQuestions/${userId}/${newQuestionRef.key}/isResponse`).set(false); // 유저 문의 저장
        res.status(201).send('Question created successfully');
    } catch (error) { // 문의 저장 실패 시
        res.status(500).send(error.message);
    }
}

async function userQuestionList(req, res) {
    const userId = req.params.userId; // userId 파라미터 추출
    const ref = db.ref(`userQuestions/${userId}`); // 유저 문의 레퍼런스
    try {
        const snapshot = await ref.once('value'); // 유저 문의 리스트 가져오기
        if (snapshot.exists()) { // 유저 문의 리스트가 있을 시
            res.status(200).send(snapshot.val());
        } else { // 유저 문의 리스트가 없을 시
            res.status(404).send('No data available');
        }
    } catch (error) { // 유저 문의 리스트 가져오기 실패 시
        res.status(500).send(error.message);
    }
}

async function getOneQuestion(req, res) {
    const questionId = req.params.questionId; // questionId 파라미터 추출
    const ref = db.ref(`questions/${questionId}`); // 특정 문의 레퍼런스
    try {
        const snapshot = await ref.once('value'); // 특정 문의 가져오기
        if (snapshot.exists()) { // 특정 문의가 있을 시
            res.status(200).send(snapshot.val());
        } else { // 특정 문의가 없을 시
            res.status(404).send('No data available');
        }
    } catch (error) { // 특정 문의 가져오기 실패 시
        res.status(500).send(error.message);
    }
}

async function registResponse(req, res) {
    const questionId = req.params.questionId; // questionId 파라미터 추출
    const { response, userId } = req.body; // response 추출
    try {
        await db.ref(`questions/${questionId}/response`).set(response); // 문의 답변 저장
        await db.ref(`userQuestions/${userId}/${questionId}/isResponse`).set(true); // 답변 여부 설정
        res.status(200).send('Response submitted successfully');
    } catch (error) { // 문의 답변 저장 실패 시
        console.log(userId);
        console.log(error);
        res.status(500).send(error.message);
    }
}

module.exports = {
    getQuestionList, registQuestion, userQuestionList, getOneQuestion, registResponse
};

const firebase = require('../../firebase');

const db = firebase.db; // firebase database 초기화

async function getProductReview(req, res) {
    const productId = req.params.productId; // productId 파라미터 추출
    const reviewRef = db.ref(`reviews/${productId}`); // 리뷰 정보 레퍼런스
    try {
        const snapshot = await reviewRef.get(); // 리뷰 정보 가져오기
        if (snapshot.exists()) { // 리뷰 정보가 있을 시
            res.status(200).json(snapshot.val());
        } else { // 리뷰 정보가 없을 시
            res.status(404).json({ message: 'review not found' });
        }
    } catch (error) { // 리뷰 정보 가져오기 실패 시
        res.status(500).json({ message: 'Error fetching review', error });
    }
}

async function registReview(req, res) {
    const { userId, productId, orderId, reviewData } = req.body; // userId, productId, orderId, reviewData 추출
    const reviewKey = db.ref(`reviews/${productId}`).push().key; // 리뷰 키 생성
    reviewData['registTime'] = new Date().toLocaleString('ko-KR', { // 현재 시간 생성
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,    // 24시간 형식 사용
        timeZone: 'Asia/Seoul'    // 한국 표준시 (KST)
    });
    console.log(reviewData);
    const updates = {}; // 업데이트할 데이터
    updates[`reviews/${productId}/${reviewKey}`] = reviewData; // 리뷰 정보 업데이트
    updates[`orders/${userId}/${orderId}/isReviewed`] = 1; // 리뷰 작성 여부 업데이트
    try {
        await db.ref().update(updates); // 데이터 업데이트
        res.status(201).send('Review created successfully and order updated');
    } catch (error) { // 리뷰 저장 실패 시
        res.status(500).send(error.message);
    }
}

module.exports = {
    getProductReview, registReview
};

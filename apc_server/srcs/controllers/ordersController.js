const firebase = require('../../firebase');

const db = firebase.db; // firebase database 초기화

async function makeOrder(req, res) {
    // 주문 정보, 배송 대기 정보, id, productId, quantity, provider_Name, orderedPrice 추출
    const { newOrder, newDeliveryWait, id, productId, quantity, provider_Name, orderedPrice } = req.body;
    const orderRef = db.ref(`orders/${id}`); // 주문 정보 레퍼런스
    try {
        const productRef = db.ref(`products/${productId}`); // 상품 정보 레퍼런스

        await productRef.transaction((product) => { // 상품 정보 업데이트
            if (product) {
                if (product.pQuantity >= quantity) { // 주문 수량이 재고 수량보다 작을 시
                    product.pQuantity -= quantity;
                } else { // 주문 수량이 재고 수량보다 클 시
                    throw new Error('주문 수량이 재고 수량보다 많습니다.');
                }
            }
            return product;
        });

        try {
            // 주문 정보 db에 저장
            const newOrderRef = orderRef.push(); // 주문 정보 레퍼런스 생성

            const orderID = newOrderRef.key; // 주문 ID 생성

            const nowDate = new Date().toLocaleString('ko-KR', { // 현재 시간 생성
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false,    // 24시간 형식 사용
                timeZone: 'Asia/Seoul'    // 한국 표준시 (KST)
            });
            newOrder.orderedDate = nowDate;
            newDeliveryWait.orderedDate = nowDate;

            const updates = {}; // 업데이트할 데이터
            updates[`orders/${id}/${orderID}`] = newOrder; // 주문 정보 업데이트
            updates[`deliveryWaits/${provider_Name}/${productId}/${orderID}`] = newDeliveryWait; // 배송 대기 정보 업데이트
            // 주문 관련 데이터 동시 업데이트 (원자성 만족)
            await db.ref().update(updates); // 데이터 업데이트

            res.status(200).json({ message: `총 ${quantity}kg 주문하셨습니다. 가격은 ${orderedPrice}원 입니다.` });
        } catch (error) { // 주문 데이터 저장 실패 시
            // 주문 데이터 저장 중 문제 생겼으니 뺏던 수량 원상 복구
            await productRef.transaction((product) => {
                if (product) {
                    product.pQuantity += quantity; // 주문 수량만큼 재고 수량 복구
                }
                return product;
            });
            console.log(error);
            res.status(500).json({ message: '주문 데이터 저장 중 문제가 발생했습니다.', error });
        }
    } catch (error) { // 상품 정보 업데이트 실패 시
        console.log(error);
        res.status(500).json({ message: '수량 확인 및 업데이트 중 문제가 발생했습니다.', error });
    }
}

async function deliveryStart(req, res) {
    const { id, orderid } = req.params; // id, orderid 파라미터 추출
    const { trackingNumber, productId, userId } = req.body; // body에서 trackingNumber, productId, userId 추출
    const orderRef = db.ref(); // DB root 레퍼런스
    try {
        if (!trackingNumber || trackingNumber === '') { // 운송장 번호가 없을 시
            res.status(400).json({ message: 'Tracking number is required' });
            return;
        }
        const departedDate = new Date().toLocaleString('ko-KR', { // 출발일 생성(현재 시간)
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,    // 24시간 형식 사용
            timeZone: 'Asia/Seoul'    // 한국 표준시 (KST)
        }); // 출발일 생성
        const updates = {} // 업데이트할 데이터
        updates[`orders/${userId}/${orderid}/departedDate`] = departedDate // 출발일 업데이트
        updates[`orders/${userId}/${orderid}/deliveryStatus`] = 1 // 배송 상태 업데이트
        updates[`deliveryWaits/${id}/${productId}/${orderid}/deliveryStatus`] = 1 // 배송 대기 상태 업데이트
        updates[`orders/${userId}/${orderid}/trackingNum`] = trackingNumber // 운송장 번호 업데이트
        await orderRef.update(updates); // 데이터 업데이트
        res.status(200).json({ message: 'Departed' });
    } catch (error) { // 업데이트 실패 시
        console.log(error);
        res.status(500).json({ message: 'Error updating order', error });
    }
}

async function deliveryComplete(req, res) {
    const { id, orderid } = req.params; // id, orderid 파라미터 추출
    const { productId, userId } = req.body; // body에서 productId, userId 추출
    const orderRef = db.ref(); // DB root 레퍼런스
    try {
        const arrivedDate = new Date().toLocaleString('ko-KR', { // 도착일 생성(현재 시간)
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,    // 24시간 형식 사용
            timeZone: 'Asia/Seoul'    // 한국 표준시 (KST)
        }); // 도착일 생성
        const updates = {} // 업데이트할 데이터
        updates[`orders/${userId}/${orderid}/arrivedDate`] = arrivedDate // 도착일 업데이트
        updates[`orders/${userId}/${orderid}/deliveryStatus`] = 2 // 배송 상태 업데이트
        updates[`deliveryWaits/${id}/${productId}/${orderid}`] = null // 배송 대기 목록에서 삭제
        await orderRef.update(updates); // 데이터 업데이트
        res.status(200).json({ message: 'Departed' });
    } catch (error) { // 업데이트 실패 시
        res.status(500).json({ message: 'Error updating order', error });
    }
}

async function deliveryWaitsList(req, res) {
    const { providerId } = req.params; // providerId 파라미터 추출
    const deliveryRef = db.ref(`deliveryWaits/${providerId}`); // 배송 대기 목록 레퍼런스
    try {
        const snapshot = await deliveryRef.get(); // 배송 대기 목록 가져오기
        if (snapshot.exists()) { // 배송 대기 목록이 있을 시
            res.status(200).json(snapshot.val());
        } else { // 배송 대기 목록이 없을 시
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) { // 배송 대기 목록 가져오기 실패 시
        res.status(500).json({ message: 'Error fetching deliveryWaits', error });
    }
}

async function getUserOrder(req, res) {
    const { id } = req.params; // id 파라미터 추출
    const orderRef = db.ref(`orders/${id}`); // 주문 정보가 있는 db 레퍼런스
    try {
        const snapshot = await orderRef.once('value'); // 주문 정보 가져오기
        if (snapshot.exists()) { // 주문 정보가 있을 시
            res.status(200).json(snapshot.val());
        } else { // 주문 정보가 없을 시
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) { // 주문 정보 가져오기 실패 시
        res.status(500).json({ message: 'Error fetching order', error });
    }
}

async function getOneOrder(req, res) {
    const { id, orderid } = req.params; // id, orderid 파라미터 추출
    const orderRef = db.ref(`orders/${id}/${orderid}`); // 주문 정보가 있는 db 레퍼런스
    try {
        const snapshot = await orderRef.get(orderRef); // 주문 정보 가져오기
        if (snapshot.exists()) { // 주문 정보가 있을 시
            res.status(200).json(snapshot.val());
        } else { // 주문 정보가 없을 시
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) { // 주문 정보 가져오기 실패 시
        res.status(500).json({ message: 'Error fetching order', error });
    }
}

module.exports = {
    makeOrder, deliveryComplete, deliveryWaitsList, deliveryStart, getOneOrder, getUserOrder
};

const admin = require('firebase-admin');
const firebase = require('../../firebase');

const db = firebase.db; // firebase database 초기화

async function getProductList(req, res) {
    const productRef = db.ref(`products`); // 상품 목록 레퍼런스
    try {
        const snapshot = await productRef.get(); // 상품 목록 가져오기
        if (snapshot.exists()) { // 상품 목록이 있을 시
            res.status(200).json(snapshot.val());
        } else { // 상품 목록이 없을 시
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) { // 상품 목록 가져오기 실패 시
        res.status(500).json({ message: 'Error fetching deliveryWaits', error });
    }
}

async function getProductInfo(req, res) {
    const productId = req.params.productId; // productId 파라미터 추출
    const productRef = db.ref(`products/${productId}`); // 상품 정보 레퍼런스
    try {
        const snapshot = await productRef.get(); // 상품 정보 가져오기
        if (snapshot.exists()) { // 상품 정보가 있을 시
            res.status(200).json(snapshot.val());
        } else { // 상품 정보가 없을 시
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) { // 상품 정보 가져오기 실패 시
        res.status(500).json({ message: 'Error fetching Product', error });
    }
}

async function storeProductImage(req, res) {
    const { name } = req.params; // name 파라미터 추출
    const image = req.file.buffer; // 이미지 데이터 추출
    const bucket = admin.storage().bucket('unity-apc.appspot.com'); // 이미지 저장 버킷(스토리지)
    try {
        const file = bucket.file(`product_images/${name}`); // 이미지 파일 생성
        await file.save(image, { // 이미지 저장
            metadata: { contentType: req.file.mimetype } // 이미지 타입 설정
        });
        const url = await file.getSignedUrl({ // 이미지 URL 생성
            action: 'read', // Read access
            expires: '03-01-2500' // URL expiration date(임의 시간)
        });
        res.status(200).json({ url: url[0] }); // 이미지 URL 전송
    } catch (error) { // 이미지 업로드 실패 시
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Error uploading image', error });
    }
}

async function isProvideProduct(req, res) {
    const { userId } = req.params; // userId 파라미터 추출
    const { productId } = req.query; // productId 쿼리 추출

    if (!productId) { // productId가 없을 시
        return res.status(400).json({ message: 'Product ID is required' });
    }

    const userRef = db.ref(`users/${userId}/provide/${productId}`); // 판매자인지 확인할 레퍼런스

    try {
        const snapshot = await userRef.get(); // 판매자인지 확인
        if (snapshot.exists() && snapshot.val() === true) {
            res.status(200).json({ isProvider: true }); // 판매자일 시
        } else {
            res.status(200).json({ isProvider: false }); // 판매자가 아닐 시
        }
    } catch (error) { // 판매자 확인 실패 시
        res.status(500).json({ message: 'Error checking provider status', error });
    }
}

async function addProvideProduct(req, res) {
    const { userId } = req.params; // userId 파라미터 추출
    const { productName } = req.body; // body에서 productName 추출

    const userRef = db.ref(`users/${userId}/provide/${productName}`); // 판매자 품목 추가 레퍼런스
    try {
        await userRef.set(true); // 판매자 품목 추가
        res.status(200).json({ productName });
    } catch (error) { // 상품 등록 실패 시
        res.status(500).json({ message: 'Error fetching products', error });
    }
}

async function registProduct(req, res) {
    const { product_data } = req.body; // body에서 product_data 추출
    const productRef = db.ref(`products`); // 상품 목록 레퍼런스
    try {
        const result = await productRef.push(product_data); // 상품 등록
        if (result) { // 상품 등록 성공 시
            res.status(200).json({ key: result.key });
        } else { // 상품 등록 실패 시
            res.status(404).json({ message: 'product can\'t register' });
        }
    } catch (error) { // 상품 등록 실패 시
        res.status(500).json({ message: 'Error fetching products', error });
    }
}

async function modifiedProduct(req, res) {
    const { productId } = req.params; // productId 파라미터 추출
    const { product_data } = req.body; // body에서 produc_data 추출
    const productRef = db.ref(); // 상품 목록 레퍼런스

    try {
        const updates = {};
        updates[`products/${productId}`] = product_data;
        console.log(product_data);
        await productRef.update(updates);
        res.status(200).json({ message: 'complete' });
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: 'product can\'t modified' });
    }

}

module.exports = {
    getProductInfo, getProductList, registProduct, storeProductImage, isProvideProduct, addProvideProduct, modifiedProduct
};

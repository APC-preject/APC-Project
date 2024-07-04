const express = require('express');

const handler = require('../controllers/ordersController');
const tokenVerify = require('../middleware/token-verify');

const router = express.Router();

router.use(tokenVerify.tokenVerify);

router.post('/', handler.makeOrder);

router.post('/go/:id/:orderid', handler.deliveryStart);

router.post('/arrive/:id/:orderid', handler.deliveryComplete);

router.get('/deliveryWaits/:providerId', handler.deliveryWaitsList);

router.get('/:id', handler.getUserOrder);

router.get('/:id/:orderid', handler.getOneOrder);


module.exports = { router };

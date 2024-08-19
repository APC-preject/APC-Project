const express = require('express');

const handler = require('../controllers/stockController');

const router = express.Router();

router.get('/reserveList', handler.getReserveList);

router.get('/place/:x/:y', handler.getPlaceRemain);

router.get(`/timestamp`, handler.getStockTimeList);
router.put(`/timestamp/:time`, handler.setStockPlace);

router.put('/reserveList/accept/:id', handler.acceptReserve);
router.put('/reserveList/reject/:id', handler.rejectReserve);




module.exports = { router };

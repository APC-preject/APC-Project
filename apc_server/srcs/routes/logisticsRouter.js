const express = require('express');

const handler = require('../controllers/logisticsController');

const router = express.Router();

router.get('/', handler.getLogisticsList);
router.post('/:releaseId', handler.updateLogisticsInfo);

module.exports = { router };

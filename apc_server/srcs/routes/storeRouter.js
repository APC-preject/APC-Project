const express = require('express');

const handler = require('../controllers/storeController');

const router = express.Router();

router.post('/', handler.addStore);

router.get('/', handler.getStoreList);

router.get('/generate/:id', handler.getStoreCheckGenerate);

router.put('/:id', handler.storeClassification);

router.put('/class/:id', handler.storeClassificationTrue);

module.exports = { router };

const express = require('express');

const handler = require('../controllers/releaseController');

const router = express.Router();

router.post(`/`, handler.addRelease);

router.get('/', handler.getReleaseList);

module.exports = { router };

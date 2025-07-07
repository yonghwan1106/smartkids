const express = require('express');
const { getChildren, addChild } = require('../controllers/childrenController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getChildren);
router.post('/', authenticateToken, addChild);

module.exports = router;

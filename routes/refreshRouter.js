const express = require("express");
const router = express.Router();

const refreshController = require('../controllers/refreshToken');

router.route('/').get(refreshController.refreshToken);
module.exports = router;
const express = require("express");
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');

const rankingsController = require('../controllers/RankingCards');

router.route('/api/setranking').post(verifyJWT, rankingsController.setRanking);
router.route('/api/setreview').post(verifyJWT, rankingsController.setReview);

module.exports = router;
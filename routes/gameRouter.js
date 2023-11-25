const express = require("express");
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');

const gamesController = require('../controllers/Games');

router.route('/api/insertgame').post(verifyJWT, gamesController.insertGame);
router.route('/api/populatehomepage').post(verifyJWT, gamesController.populateHomePage);
router.route('/api/getgameinfo').post(verifyJWT, gamesController.getGameInfo);
router.route('/api/searchgame').post(verifyJWT, gamesController.searchGame);
router.route('/api/getcover').post(verifyJWT, gamesController.getCover);


module.exports = router;
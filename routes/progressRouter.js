const express = require("express");
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');

const progressController = require('../controllers/ProgressCards');

router.route('/api/addusergame').post(verifyJWT, progressController.addUserGame);
router.route('/api/populatelibrarypage').post(verifyJWT, progressController.populateLibraryPage);
router.route('/api/getusergame').post(verifyJWT, progressController.getUserGame);
router.route('/api/deleteusergame').post(verifyJWT, progressController.deleteUserGame);


module.exports = router;
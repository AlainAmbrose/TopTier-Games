const express = require("express");
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');

const progressController = require('../controllers/ProgressCards');

router.route('/api/addusergame').post(verifyJWT, progressController.addUserGame);
router.route('/api/populatelibrarypage').post(verifyJWT, progressController.populateLibraryPage);
router.route('/api/getusergame').post(verifyJWT, progressController.getUserGame);
router.route('/api/setstatus').post(verifyJWT, progressController.setStatus);
router.route('/api/sethoursplayed').post(verifyJWT, progressController.setHoursPlayed);
router.route('/api/deleteusergame').post(verifyJWT, progressController.deleteUserGame);
router.route('/api/checkusergame').post(progressController.checkUserGame);



module.exports = router;
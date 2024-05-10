const express = require('express');
const router = express.Router();
const contestantController = require('../controllers/contestantController');

router.post('/contestants', contestantController.createContestant);
router.get('/contestants', contestantController.getAllContestants);
router.get('/contestants/:id', contestantController.getContestantById);
router.put('/contestants/:id', contestantController.updateContestant);
router.delete('/contestants/:id', contestantController.deleteContestant);

module.exports = router;

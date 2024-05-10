const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');

router.post('/votes', voteController.createVote);
router.get('/votes', voteController.getAllVotes);
router.get('/votes/:id', voteController.getVoteById);
router.put('/votes/:id', voteController.updateVote);
router.delete('/votes/:id', voteController.deleteVote);

module.exports = router;

const express = require('express');
const router = express.Router();
const votingRoomController = require('../controllers/votingRoomController');

router.post('/voting-rooms', votingRoomController.createVotingRoom);
router.get('/voting-rooms', votingRoomController.getAllVotingRooms);
router.get('/voting-rooms/:id', votingRoomController.getVotingRoomById);
router.put('/voting-rooms/:id', votingRoomController.updateVotingRoom);
router.delete('/voting-rooms/:id', votingRoomController.deleteVotingRoom);

module.exports = router;

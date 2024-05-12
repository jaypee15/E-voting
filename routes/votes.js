const express = require("express");

const {vote, viewRoom} = require("../controllers/votes");

const router = express.Router();

router.post("/:contestantId", vote);
router.get("/:roomId", viewRoom)

// router.post("/votes", voteController.createVote);
// router.get("/votes", voteController.getAllVotes);
// router.get("/votes/:id", voteController.getVoteById);
// router.put("/votes/:id", voteController.updateVote);
// router.delete("/votes/:id", voteController.deleteVote);

module.exports = router;

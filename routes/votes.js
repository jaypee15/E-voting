const express = require("express");

const {vote, viewRoom, confirmPayment} = require("../controllers/votes");

const router = express.Router();

router.post("/:contestantId", vote);
router.get("/:roomId", viewRoom),
router.get("/payments/:contestantId", confirmPayment)

module.exports = router;

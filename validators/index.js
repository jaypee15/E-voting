const votingRoomSchema = require("./create-voting-room");
const login = require("./login");
const register = require("./register");
const update = require("./update");
const createVotingRoom = require("./create-voting-room");
const updateVotingRoom = require("./update-voting-room");

module.exports = { login, register, update, createVotingRoom, updateVotingRoom };

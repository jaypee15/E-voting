const votingRoomSchema = require("./create-voting-room");
const login = require("./login");
const register = require("./register");
const update = require("./update");

module.exports = { login, register, update, votingRoomSchema };

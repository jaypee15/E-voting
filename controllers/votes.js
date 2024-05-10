const Vote = require('../models/Vote');

const createVote = async (req, res) => {
  try {
    const vote = await Vote.create(req.body);
    res.status(201).json(vote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllVotes = async (req, res) => {
  try {
    const votes = await Vote.find();
    res.json(votes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVoteById = async (req, res) => {
  try {
    const vote = await Vote.findById(req.params.id);
    if (!vote) {
      return res.status(404).json({ message: 'Vote not found' });
    }
    res.json(vote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateVote = async (req, res) => {
  try {
    const vote = await Vote.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vote) {
      return res.status(404).json({ message: 'Vote not found' });
    }
    res.json(vote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteVote = async (req, res) => {
  try {
    const vote = await Vote.findByIdAndDelete(req.params.id);
    if (!vote) {
      return res.status(404).json({ message: 'Vote not found' });
    }
    res.json({ message: 'Vote deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createVote,
  getAllVotes,
  getVoteById,
  updateVote,
  deleteVote,
};

const Contestant = require('../models/Contestant');

const createContestant = async (req, res) => {
  try {
    const contestant = await Contestant.create(req.body);
    res.status(201).json(contestant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllContestants = async (req, res) => {
  try {
    const contestants = await Contestant.find();
    res.json(contestants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getContestantById = async (req, res) => {
  try {
    const contestant = await Contestant.findById(req.params.id);
    if (!contestant) {
      return res.status(404).json({ message: 'Contestant not found' });
    }
    res.json(contestant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateContestant = async (req, res) => {
  try {
    const contestant = await Contestant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contestant) {
      return res.status(404).json({ message: 'Contestant not found' });
    }
    res.json(contestant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteContestant = async (req, res) => {
  try {
    const contestant = await Contestant.findByIdAndDelete(req.params.id);
    if (!contestant) {
      return res.status(404).json({ message: 'Contestant not found' });
    }
    res.json({ message: 'Contestant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createContestant,
  getAllContestants,
  getContestantById,
  updateContestant,
  deleteContestant,
};

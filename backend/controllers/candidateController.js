const candidates = require("../data/candidates.json");

const getCandidates = (req, res) => {
  res.json(candidates.candidates);
};

module.exports = {
  getCandidates,
};
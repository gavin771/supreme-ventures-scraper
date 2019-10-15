const getResults = require("./getResults").getResults;
const scrapeAndStore = require("./getResults").scrapeAndStore;

exports.getGameResults = async (req, res) => {
  try {
    const gameResults = await getResults(req.params.game, req.query.draw);

    res.status(200).json(gameResults);
  } catch (e) {
    res.status(400).json({ error: e.message, result: null });
  }
};

exports.storeGameResults = async (req, res) => {
  try {
    const result = await scrapeAndStore();

    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message, result: null });
  }
};

const getResults = require("./getResults");

exports.getResults = async (req, res) => {
  try {
    const gameResults = await getResults();

    res.status(200).json(gameResults);
  } catch (e) {
    res.status(400).json(e);
  }
};

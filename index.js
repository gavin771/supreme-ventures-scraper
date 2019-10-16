const getResults = require("./getResults").getResults;
const scrapeAndStore = require("./getResults").scrapeAndStore;

const getGameResults = async (game, draw) => {
  try {
    const gameResults = await getResults(req.params.game, req.query.draw);

    return gameResults;
  } catch (e) {
    throw e;
  }
};

const storeGameResults = async game => {
  try {
    const result = await scrapeAndStore(req.params.game);
    return result;
  } catch (e) {
    throw e;
  }
};

exports.handleRequest = async (req, res) => {
  try {
    let response = null;
    const payload = req.body;
    console.log(`Received payload: ${JSON.stringify(payload)}`);

    switch (payload.action) {
      case "results":
        response = await getGameResults(payload.game, payload.draw);
        break;
      case "store":
        response = await storeGameResults(payload.game);
        break;
      default: {
        const message = `Request type is not valid: ${payload.action}`;
        throw message;
      }
    }

    logger.info(
      `Returning handleJobRequest response: ${JSON.stringify(jobResponse)}`
    );

    res.status(200).json({ error: null, result: response });
  } catch (e) {
    res.status(400).json({ error: e.message, result: null });
  }
};

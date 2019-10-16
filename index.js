const getResults = require("./getResults").getResults;
const scrapeAndStore = require("./getResults").scrapeAndStore;

exports.handleRequest = async (req, res) => {
  try {
    let response = null;
    const payload = req.body;
    console.log(`Received payload: ${JSON.stringify(payload)}`);

    switch (payload.action) {
      case "results":
        response = await getResults(payload.game, payload.draw);
        break;
      case "store":
        response = await scrapeAndStore(payload.game);
        break;
      default: {
        const message = `Request type is not valid: ${payload.action}`;
        throw new Error(message);
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

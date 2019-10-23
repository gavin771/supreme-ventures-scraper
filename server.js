const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const getResults = require("./getResults").getResults;
const scrapeAndStore = require("./getResults").scrapeAndStore;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

const app = express();
app.use(helmet());
app.use(limiter);

app.get("/", (req, res) => {
  res.status(200).send("Up and running!");
});

app.get("/store-results", async (req, res) => {
  try {
    const result = await scrapeAndStore();

    res.status(200).json({ error: null, result });
  } catch (e) {
    res.status(400).json({ error: e.message, result: null });
  }
});

app.get("/store-results/:game", async (req, res) => {
  try {
    const result = await scrapeAndStore(req.params.game);

    res.status(200).json({ error: null, result });
  } catch (e) {
    res.status(400).json({ error: e.message, result: null });
  }
});

app.get("/results/:game", async (req, res) => {
  try {
    const gameResults = await getResults(
      req.params.game,
      req.query.draw,
      req.query.date
    );

    res.status(200).json(gameResults);
  } catch (e) {
    res.status(400).json({ error: e.message, result: null });
  }
});

app.listen(process.env.PORT || 3030, () =>
  console.log(`Up and running on port ${process.env.PORT || 3030}!`)
);

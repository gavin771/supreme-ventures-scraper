const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const getResults = require("./getResults");

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

app.get("/results", async (req, res) => {
  try {
    const gameResults = await getResults();
    console.log(gameResults);

    res.status(200).json(gameResults);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.listen(process.env.PORT || 3030, () =>
  console.log(`Up and running on port ${process.env.PORT || 3030}!`)
);

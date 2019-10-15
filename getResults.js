const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const parseDate = require("date-fns/parse");
const getTime = require("date-fns/getTime");
const getYear = require("date-fns/getYear");
const getDate = require("date-fns/getDate");
const getMonth = require("date-fns/getMonth");
const storeResults = require("./firebase").save;
const retrieveGameResults = require("./firebase").retrieveGame;
const games = require("./gameConfig");

const url = "https://supremeventures.com/game-results/";

module.exports.getResults = async (gameKey = null, drawName = null) => {
  let results = null;
  let error = null;
  const currentDate = new Date();
  const date = getTime(
    new Date(getYear(currentDate), getMonth(currentDate), getDate(currentDate))
  );
  try {
    if (gameKey) {
      const game = games.find(game => game.key === gameKey);
      if (game) {
        //check db
        let numbers = await retrieveGameResults(gameKey, date, drawName);
        if (!numbers) {
          //scrape page
          const pageData = await scrapePage();

          //save to db
          saveData(pageData);

          results = parseFirebaseData(gameKey, pageData);
        } else {
          results = parseFirebaseData(gameKey, numbers);
        }
      } else {
        error = `${gameKey} does not exist.`;
      }
    } else {
      error = "Game not defined";
    }

    return { error: error, result: results };
  } catch (e) {
    throw e;
  }
};

module.exports.scrapeAndStore = async () => {
  try {
    //scrape page
    const pageData = await scrapePage();

    //save to db
    saveData(pageData);
    return true;
  } catch (e) {
    throw e;
  }
};
const scrapePage = () => {
  return puppeteer
    .launch({ args: ["--no-sandbox"] })
    .then(browser => browser.newPage())
    .then(page => {
      return page.goto(url).then(function() {
        return page.content();
      });
    })
    .then(async html => {
      const $ = cheerio.load(html);

      games.forEach(game => {
        let winningNumbers = [];
        $(game.numbersSelector).each(function() {
          winningNumbers.push(parseInt($(this).text()));
        });
        let date = $(game.dateSelector).text();
        let drawName = $(game.drawNameSelector).text();

        if (date) {
          date = getTime(parseDate(date, "EEEE, MMMM d", new Date()));
        }
        if (drawName) {
          drawName = drawName.toLowerCase().replace(/ /g, "-");
        }

        game.winningNumbers = winningNumbers;
        game.date = date;
        game.drawName = drawName;

        delete game.drawNameSelector;
        delete game.numbersSelector;
        delete game.dateSelector;
      });

      return games;
    })
    .catch(e => {
      console.error(e);
      throw e;
    });
};

/**
 *
 * @param {Object[]} games
 * @param {string} games[].title
 * @param {string} games[].key
 * @param {[]} games[].winningNumbers
 * @param {Date} games[].date
 * @param {string} games[].drawName
 */
const saveData = games => {
  return games.forEach(game => {
    storeResults(game.key, game.drawName, game.date, game.winningNumbers);
  });
};

const parseFirebaseData = (gameKey, data) => {
  const matchingGame = games.find(game => game.key === gameKey);

  if (typeof data === "object") {
    matchingGame.winningNumbers = data.find(
      game => game.key === gameKey
    ).winningNumbers;
  } else {
    matchingGame.winningNumbers = data.numbers;
  }

  delete matchingGame.dateSelector;
  delete matchingGame.drawNameSelector;
  delete matchingGame.numbersSelector;

  return matchingGame;
};

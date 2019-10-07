const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const url = "https://supremeventures.com/game-results/";
const games = [
  {
    title: "Cash Pot",
    key: "cash-pot",
    selector: ".game.cashpot .result-number"
  },
  { title: "Pick 2", key: "pick-2", selector: ".game.pick2 .result-number" },
  { title: "Pick 3", key: "pick-3", selector: ".game.pick3 .result-number" },
  { title: "Pick 4", key: "pick-4", selector: ".game.pick4 .result-number" },
  { title: "Lucky 5", key: "lucky-5", selector: ".game.lucky5 .result-number" },
  { title: "Dollaz", key: "dollaz", selector: ".game.dollaz .result-number" },
  {
    title: "Top Draw",
    key: "top-draw",
    selector: ".game.topdraw .result-number"
  },
  { title: "Lotto", key: "lotto", selector: ".game.lotto .result-number" },
  {
    title: "Super Lotto",
    key: "super-lotto",
    selector: ".game.superlotto .result-number"
  }
];

module.exports = () => {
  return puppeteer
    .launch()
    .then(browser => browser.newPage())
    .then(page => {
      return page.goto(url).then(function() {
        return page.content();
      });
    })
    .then(html => {
      const $ = cheerio.load(html);
      games.forEach(game => {
        winningNumbers = [];
        $(game.selector).each(function() {
          winningNumbers.push(parseInt($(this).text()));
        });
        game.winningNumbers = winningNumbers;
      });
      return games;
    })
    .catch(e => {
      console.error(e);
      throw e;
    });
};

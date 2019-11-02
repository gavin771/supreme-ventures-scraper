module.exports = [
  {
    name: "Cash-Pot_8-30AM",
    description: "Cashpot 8:30AM draw",
    schedule: "50 8 * * *",
    data: { action: "store", game: "cash-pot" }
  },
  {
    name: "Cash-Pot_10-30AM",
    description: "Cashpot 10:30AM draw",
    schedule: "50 10 * * *",
    data: { action: "store", game: "cash-pot" }
  },
  {
    name: "Cash-Pot_1-00PM",
    description: "Cashpot 1:00PM draw",
    schedule: "20 13 * * *",
    data: { action: "store", game: "cash-pot" }
  },
  {
    name: "Cash-Pot_3-00PM",
    description: "Cashpot 3:00PM draw",
    schedule: "20 15 * * *",
    data: { action: "store", game: "cash-pot" }
  },
  {
    name: "Cash-Pot_5-00PM",
    description: "Cashpot 5:00PM draw",
    schedule: "10 17 * * *",
    data: { action: "store", game: "cash-pot" }
  },
  {
    name: "Cash-Pot_8-25PM",
    description: "Cashpot 8:25PM draw",
    schedule: "45 20 * * *",
    data: { action: "store", game: "cash-pot" }
  },
  {
    name: "Lotto_Wed",
    description: "Lotto Wednesday draw",
    schedule: "40 20 * * 3",
    data: { action: "store", game: "lotto" }
  },
  {
    name: "Lotto_Sat",
    description: "Lotto Saturday draw",
    schedule: "40 20 * * 6",
    data: { action: "store", game: "lotto" }
  }
];

const controller = require("controller");

module.exports = exports = {
  checkExchangeDropdown: () => {
    const exchangeDropdownValue = document.getElementById("exchange-dropdown")
      .value;
    if (exchangeDropdownValue == 0) {
      return false;
    } else {
      return true;
    }
  },

  checkStrategyDropdown: () => {
    const strategyDropdownValue = document.getElementById("strategy-dropdown")
      .value;
    if (strategyDropdownValue == 0) {
      return false;
    } else {
      return true;
    }
  },
};

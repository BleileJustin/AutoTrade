module.exports = exports = {
  getExchangeChoice: () => {
    const exchangeDropdownChoice = document.getElementById("exchange-dropdown")
      .value;
    console.log(exchangeDropdownChoice);
    return exchangeDropdownChoice;
  },

  checkExchangeDropdown: () => {
    const exchangeDropdownValue = document.getElementById("exchange-dropdown")
      .value;
    if (exchangeDropdownValue == 0) {
      return false;
    } else {
      return true;
    }
  },

  getStrategyChoice: () => {
    const strategyDropdownChoice = document.getElementById("strategy-dropdown")
      .value;
    console.log(strategyDropdownChoice);
    return strategyDropdownChoice;
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

  getCurrencyChoice: () => {
    const currencyDropdownChoice = document.getElementById("currency-dropdown")
      .value;
    console.log(currencyDropdownChoice);
    return currencyDropdownChoice;
  },

  checkCurrencyDropdown: () => {
    const currencyDropdownValue = document.getElementById("currency-dropdown")
      .value;

    if (currencyDropdownValue == 0) {
      return false;
    } else {
      return true;
    }
  },
};

module.exports = exports = {
  getExchangeChoice: (id) => {
    const exchangeDropdownChoice = document.getElementById(
      "exchange-dropdown" + id
    ).value;
    return exchangeDropdownChoice;
  },

  checkExchangeDropdown: (id) => {
    const exchangeDropdownValue = document.getElementById(
      "exchange-dropdown" + id
    ).value;
    if (exchangeDropdownValue == 0) {
      return false;
    } else {
      return true;
    }
  },

  getStrategyChoice: (id) => {
    const strategyDropdownChoice = document.getElementById(
      "strategy-dropdown" + id
    ).value;
    return strategyDropdownChoice;
  },

  checkStrategyDropdown: (id) => {
    const strategyDropdownValue = document.getElementById(
      "strategy-dropdown" + id
    ).value;
    if (strategyDropdownValue == 0) {
      return false;
    } else {
      return true;
    }
  },

  getCurrencyChoice: (id) => {
    const currencyDropdownChoice = document.getElementById(
      "currency-dropdown" + id
    ).value;
    return currencyDropdownChoice;
  },

  checkCurrencyDropdown: (id) => {
    const currencyDropdownValue = document.getElementById(
      "currency-dropdown" + id
    ).value;

    if (currencyDropdownValue == 0) {
      return false;
    } else {
      return true;
    }
  },
};

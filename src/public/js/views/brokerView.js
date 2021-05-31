module.exports = exports = {
  newBrokerView: (id) => {
    let brokerView =
      `
    <div class="broker-view" id="broker-view-` +
      id +
      `">
      <div class="parameter">
        <select id="exchange-dropdown" name="exchanges">
          <option value="0">Exchange</option>
          <option value="Binance">Binance</option>
          <option value="CoinbasePro">CoinbasePro</option>
        </select>
      </div>
      <div class="parameter">
        <select id="strategy-dropdown" name="strategies">
          <option value="0">Strategy</option>
          <option value="BollingerBands">BollingerBands</option>
          <option value="MACD">MACD</option>
          <option value="HODL">HODL</option>
        </select>
      </div>
      <div class="parameter">
        <select id="currency-dropdown" name="currencies">
          <option value="0">Currency</option>
          <option value="VET">VET</option>
          <option value="UNI">UNI</option>
          <option value="OXT">OXT</option>
        </select>
      </div>

      <div id="button-container">
        <button id="start">START</button>
      </div>
    </div>`;
    document
      .getElementById("broker-list")
      .insertAdjacentHTML("beforeend", brokerView);
  },

  switchButtonToStop: () => {
    document.getElementById("start").remove();
    document
      .getElementById("button-container")
      .insertAdjacentHTML("beforeend", `<button id="stop">STOP</button>`);
  },

  switchButtonToStart: () => {
    document.getElementById("stop").remove();
    document
      .getElementById("button-container")
      .insertAdjacentHTML("beforeend", `<button id="start">START</button>`);
  },
};

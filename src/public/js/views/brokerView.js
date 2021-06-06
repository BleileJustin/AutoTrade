module.exports = exports = {
  newBrokerView: (id) => {
    let brokerView =
      `
    <div class="broker-view" id="broker-view-` +
      id +
      `">
      <div class="parameter">
        <select class="exchange-dropdown" id="exchange-dropdown` +
      id +
      `" name="exchanges">
          <option value="0">Exchange</option>
          <option value="Binance">Binance</option>
          <option value="CoinbasePro">CoinbasePro</option>
        </select>
      </div>
      <div class="parameter">
        <select class="strategy-dropdown" id="strategy-dropdown` +
      id +
      `" name="strategies">
          <option value="0">Strategy</option>
          <option value="BollingerBands">BollingerBands</option>
          <option value="MACD">MACD</option>
          <option value="HODL">HODL</option>
        </select>
      </div>
      <div class="parameter">
        <select class="currency-dropdown" id="currency-dropdown` +
      id +
      `" name="currencies">
          <option value="0">Currency</option>
          <option value="VET">VET</option>
          <option value="UNI">UNI</option>
          <option value="OXT">OXT</option>
        </select>
      </div>

      <div class="button-container" id="button-container-` +
      id +
      `">
        <button class="start" id="start` +
      id +
      `">START</button>
        <button class="delete" id="delete` +
      id +
      `"></button>
      </div>
    </div>`;
    document
      .getElementById("broker-list")
      .insertAdjacentHTML("beforeend", brokerView);
  },

  switchButtonToStop: (id) => {
    console.log(id);
    document.getElementById("delete" + id).remove();
    document.getElementById("start" + id).remove();
    document
      .getElementById("button-container-" + id)
      .insertAdjacentHTML(
        "beforeend",
        `<button class="stop" id="stop` + id + `">STOP</button>`
      );
  },

  switchButtonToStart: (id) => {
    document.getElementById("stop" + id).remove();
    document
      .getElementById("button-container-" + id)
      .insertAdjacentHTML(
        "beforeend",
        `<button class="start" id="start` + id + `">START</button>`
      );

    document
      .getElementById("button-container-" + id)
      .insertAdjacentHTML(
        "beforeend",
        `<button class = delete id="delete` + id + `"></button>`
      );
  },

  deleteBrokerView: (id) => {
    document.getElementById("broker-view-" + id).innerHTML = "";
    document.getElementById("broker-view-" + id).remove();
  },
};

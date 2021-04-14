const controller = require("./controller/index.js");
const elements = require("./views/base.js");

window.onload = function () {
  document
    .getElementById("start")
    .addEventListener("click", controller.startBroker);
  document
    .getElementById("stop")
    .addEventListener("click", controller.stopBroker);
};

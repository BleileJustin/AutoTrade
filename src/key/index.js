const config = require("../../../config/config.json");

exports.get = (key) => config[key];

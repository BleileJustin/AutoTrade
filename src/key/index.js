const config = require("../config.json");

exports.get = key => config[key];

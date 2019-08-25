"use strict";

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = "production";

var chalk = require("chalk");
var path = require("path");

var homeConfig = require(path.resolve(__dirname, "../package.json"));

var _require = require("./functions"),
    log = _require.log,
    warn = _require.warn;

process.title = "spring.js";
/**
 * @description
 * Constructor to start the SpringJS
 *
 * @example
 * ```js
 *   const SpringJS = require("js-spring");
 *   new SpringJS({ name: "example" });
 * ```
 */

var SpringJS = function SpringJS(options) {
  (0, _classCallCheck3.default)(this, SpringJS);

  if (exports.started) {
    throw new Error("Spring already initialized!");
  } else {
    exports.started = true;
  }
  log(chalk.bold.bgGreen.black(" " + homeConfig.name + "-" + homeConfig.version + " starting"));
  if ((typeof options === "undefined" ? "undefined" : (0, _typeof3.default)(options)) !== "object") {
    throw new TypeError("Expected object for constructor");
  }
  if (!options.name || typeof options.name !== "string") {
    throw new TypeError("Name is required and needs to be a string");
  }
  if (!options.port || isNaN(parseInt(options.port))) {
    warn("No valid port provided, using 8080");
    options.port = 8080;
  }
  if (!options.mongo || !options.mongo.startsWith("mongodb") || typeof options.mongo !== "string") {
    warn("No valid mongo database url provided, database will not initialize");
    options.mongo = null;
  } else {
    options.mongo = options.mongo.endsWith("/") ? options.mongo + options.name : options.mongo + "/" + options.name;
  }
  if (options.log && typeof options.log !== "boolean") {
    throw new TypeError("Value of log option needs to be a boolean");
  }
  if (!options.viewsDir || typeof options.viewsDir !== "string") {
    options.viewsDir = path.resolve(process.cwd().toString(), "views");
    warn("No valid view directory provided, using " + options.viewsDir);
  } else {
    options.viewsDir = path.resolve(process.cwd().toString(), options.viewsDir);
  }
  if (!options.publicDir || typeof options.publicDir !== "string") {
    options.publicDir = path.resolve(process.cwd(), "public");
    warn("No valid public directory provided, using " + options.publicDir);
  } else {
    options.publicDir = path.resolve(process.cwd().toString(), options.publicDir);
  }
  this.options = options;
  this.base = process.cwd();
  module.exports = this;
  require("./bin/www").start(function (err) {
    if (process.env.TEST || typeof options.exited === "function") {
      if (err) {
        console.error(err);
        throw err;
      }
      if (options.exited) {
        options.exited();
      } else {
        process.exit(0);
      }
    } else {
      console.error(err);
    }
  }, options);
  this.database = require("./main/server").db;
  this.app = require("./main/server").app;
  this.socket = require("./bin/www").sio;
  if (typeof this.onready === "function") {
    this.onready(this);
  }
  module.exports = this;
};

module.exports = SpringJS;
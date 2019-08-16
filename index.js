const chalk = require("chalk");
const path = require("path");
const homeConfig = require("./package.json");
const { log, warn } = require("./functions");

/**
 * @description
 * Constructor to start the SpringJS
 *
 * @example
 * ```js
 *   const SpringJS = require("spring.js");
 *   new SpringJS({ name: "example" });
 * ```
 */

class SpringJS {
  constructor(options) {
    if (exports.started) {
      throw new Error("Spring already initialized!");
    } else {
      exports.started = true;
    }
    log(
      chalk.bold.bgGreen.black(
        ` ${homeConfig.name}-${homeConfig.version} starting`
      )
    );
    if (typeof options != "object") {
      throw new TypeError("Expected object for constructor");
    }
    if (!options.name || typeof options.name != "string") {
      throw new TypeError("Name is required and needs to be a string");
    }
    if (!options.port || isNaN(parseInt(options.port))) {
      warn("No valid port provided, using 8080");
      options.port = 8080;
    }
    if (
      !options.mongo ||
      !options.mongo.startsWith("mongodb://") ||
      typeof options.mongo != "string"
    ) {
      warn(
        "No valid mongo database url provided, using mongodb://localhost:27017/"
      );
      options.mongo = "mongodb://localhost:27017/";
    }
    options.mongo = options.mongo.endsWith("/")
      ? options.mongo + options.name
      : options.mongo + "/" + options.name;
    if (options.socket && typeof options.socket != "boolean") {
      throw new TypeError("Value of Socket option needs to be a boolean");
    }
    if (options.log && typeof options.log != "boolean") {
      throw new TypeError("Value of log option needs to be a boolean");
    }
    if (!options.viewsDir || typeof options.viewsDir != "string") {
      options.viewsDir = path.resolve(process.cwd().toString(), "views");
      warn("No valid view directory provided, using " + options.viewsDir);
    } else {
      options.viewsDir = path.resolve(
        process.cwd().toString(),
        options.viewsDir
      );
    }
    if (!options.publicDir || typeof options.publicDir != "string") {
      options.publicDir = path.resolve(process.cwd().toString(), "public");
      warn("No valid public directory provided, using " + options.publicDir);
    } else {
      options.publicDir = path.resolve(
        process.cwd().toString(),
        options.publicDir
      );
    }
    this.options = options;
    this.base = process.cwd();
    this.package = require(this.base + "/package.json");
    this.app = require("express").Router();
    this.options.version = this.package.version;
    module.exports = this;
    require("./bin/www").start(function(err) {
      if (process.env.TEST || typeof options.exited == "function") {
        if (err) {
          throw err;
        }
        options.exited();
      } else {
        console.error(err);
      }
    }, options);
    this.database = require("./src/server").db;
    this.socket = require("./bin/www").sio;
    module.exports = this;
  }
}
module.exports = SpringJS;

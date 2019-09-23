const chalk = require("chalk");
const path = require("path");

const homeConfig = require(path.resolve(__dirname, "../package.json"));
const { log, warn } = require("./functions");
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
    if (typeof options !== "object") {
      throw new TypeError(
        "Expected object for constructor, please read docs: https://spring.js.org/startup"
      );
    }
    if (options.cdn && options.cdn !== "object") {
      throw new TypeError("Cdn mode requires an object");
    }
    if (!options.name || typeof options.name !== "string") {
      throw new TypeError(
        "Name is required and needs to be a string, please read docs: https://spring.js.org/startup#name"
      );
    }
    if (!options.port || isNaN(parseInt(options.port))) {
      warn(
        "No valid port provided, using 8080, in the future please read docs: https://spring.js.org/startup#port"
      );
      options.port = 8080;
    }
    if (
      !options.mongo ||
      !options.mongo.startsWith("mongodb") ||
      typeof options.mongo !== "string"
    ) {
      warn(
        "No valid mongo database url provided, database will not initialize, in the future please read docs: https://spring.js.org/startup#mongo"
      );
      options.mongo = null;
    } else {
      options.mongo = options.mongo.endsWith("/")
        ? options.mongo + options.name
        : `${options.mongo}/${options.name}`;
    }
    if (options.routes && typeof options.routes !== "object") {
      this.routes = null;
      throw new TypeError(
        "Value of router option must be an array, please read docs: https://spring.js.org/startup#routes"
      );
    }
    if (options.log && typeof options.log !== "boolean") {
      throw new TypeError(
        "Value of log option needs to be a boolean, please read docs: https://spring.js.org/startup#log"
      );
    }
    if (!options.viewsDir || typeof options.viewsDir !== "string") {
      options.viewsDir = path.resolve(process.cwd().toString(), "views");
      warn(
        `No valid view directory provided, using ${options.viewsDir}, in the future please read docs: https://spring.js.org/startup#views-directory`
      );
    } else {
      options.viewsDir = path.resolve(
        process.cwd().toString(),
        options.viewsDir
      );
    }
    if (!options.publicDir || typeof options.publicDir !== "string") {
      options.publicDir = path.resolve(process.cwd(), "public");
      warn(
        `No valid public directory provided, using ${options.publicDir}, in the future please read docs: https://spring.js.org/startup#public-directory`
      );
    } else {
      options.publicDir = path.resolve(
        process.cwd().toString(),
        options.publicDir
      );
    }
    this.options = options;
    this.base = process.cwd();
    module.exports = this;
    require("./bin/www").start(err => {
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
    this.express = require("express");
    this.router = this.express.Router();
    this.socket = require("./bin/www").sio;
    module.exports = this;
  }
}
module.exports = SpringJS;

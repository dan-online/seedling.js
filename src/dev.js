var Springjs = require("../index");
var app = new Springjs({
    name: "test",
    port: 8080,
    log: true,
    mongo: "mongodb://localhost:27017/",
    viewsDir: __dirname + "/views",
    publicDir: __dirname + "/public"
}).app;
app.get("/test", function (req, res) {
    res.send("SpringJS is the best");
});

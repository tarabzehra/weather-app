var path = require("path");
var express = require("express");
var zipdb = require("zippity-do-dah");
var ForecastIo = require("forecastio");
var request = require("request");

var app = express();
var weather = "https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=a8ef7f63a11b0e76cb50bd70d115a2b8"

app.use(express.static(path.resolve(__dirname, "public")));

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");


app.get("/", function (req, res) {
    res.render("index");
});

app.post("/", function (req, res) {
    console.log(req.body)
});

app.get(/^\/(\d{5})$/, function (req, res, next) {
    var zipcode = req.params[0];
    console.log(req.params);
    var location = zipdb.zipcode(zipcode);
    if (!location.zipcode) {
        next();
        return;
    }

    var latitude = location.latitude;
    var longitude = location.longitude;

    weather.forecast(latitude, longitude, function (err, data) {
        if (err) {
            next();
            return;
        }

        res.json({
            zipcode: zipcode,
            temperature: data.currently.temperature
        });
    });
});

app.use(function (req, res) {
    res.status(404).render("404");
});
app.listen(3000);
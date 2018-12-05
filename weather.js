const https = require("https");
const http = require("http");
const api = require("./api.json");

function printWeather(weather) {
    const message = `Current temperature in ${weather.name} is ${weather.main.temp} C`;
    console.log(message);
}

function printError(error) {
    console.error(error.message);
}

function get(query) {
    try {
        const request = https.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=${api.key}&units=metric`, response => {
            if (response.statusCode === 200) {
                let body = "";
                response.on("data", chunk => {
                    body += chunk;
                });
                response.on("end", () => {
                    try {
                        const weather = JSON.parse(body);
                        if (weather.name) {
                            printWeather(weather);
                        }else{
                            const statusErrorCode = new Error(`There location "${query}" was not found`);
                            printError(statusErrorCode);
                        }

                    } catch (error) {
                        printError(error);
                    }
                })
            } else {
                const statusErrorCode = new Error(`There was an error getting the message for "${query}". (${http.STATUS_CODES[response.statusCode]})`);
                printError(statusErrorCode);
            }
        })
    } catch (error) {
        printError(error);
    }

}
module.exports.get = get;
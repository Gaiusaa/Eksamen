// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// App
const app = express();

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.urlencoded({extended: true}));

app.use("/api", require("./routes/api"));

// Function
dbConnect();
function onConnect() {
    console.log(`App is running on port ${process.env.PORT}`);
};
async function dbConnect() {
    try {
        const connected = await mongoose.connect(process.env.DB_URI);
        if (!connected) return console.error("Could not connected to DB");
        app.listen(process.env.PORT, onConnect);
    } catch (error) {
        console.log(`DB connect error: ${error}`);
    };
};
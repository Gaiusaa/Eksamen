const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    admin: {type: Boolean, required: true},
}, {Collection: "users"});
const user = mongoose.model("user", userSchema);
module.exports = {user};
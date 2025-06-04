// Dependencies
const jwt = require("jsonwebtoken");
const validator = require("validator");
require("dotenv").config();
const responderMiddleware = require("./responder");

const {user} = require("../models/user");

// Functions
const hasToken = (req, res, next) => {
    const {authToken} = req.cookies;
    if (!authToken) return responderMiddleware.successResponse(res, 403, false, "You do not have access to this");
    const payload = jwt.verify(authToken, process.env.JWT_SECRET)
    if (!payload) return responderMiddleware.successResponse(res, 403, false, "You do not have access to this");
    next();
};

const noToken = (req, res, next) => {
    const {authToken} = req.cookies;
    if (authToken) return responderMiddleware.successResponse(res, 403, false, "You do not have access to this");
    next();
};

const signupFields = (req, res, next) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password || !validator.isEmail(email)) return responderMiddleware.successResponse(res, 401, false, "Missing data to make user");
    next();
};

const loginFields = (req, res, next) => {
    const {email, password} = req.body;
    if (!email || !validator.isEmail(email) || !password) return responderMiddleware.successResponse(res, 401, false, "Missing data to authenticate user");
    next();
};

const userField = (req, res, next) => {
    const {username} = req.params;
    if (!username) return responderMiddleware.successResponse(res, 401, false, "Missing data for request");
    next();
}

const updateField = (req, res, next) => {
    const {username} = req.params;
    const {data} = req.body;
    if (!username || !data) return responderMiddleware.successResponse(res, 401, false, "Missing data to update user");
    next();
}

const updateCheck = async (req, res, next) => {
    const {username} = req.params;
    try {
         const token = jwt.verify(req.cookies.authToken, process.env.JWT_SECRET);
         if (!token) return responderMiddleware.successResponse(res, 401, false, "Server could not authenticate you");
         if (username !== token.username) {
            const usr = await user.findOne({username: token.username});
            if (!usr || usr.admin !== true) return responderMiddleware.successResponse(res, 403, false, "You do not have access to this")
         };
        next();
    } catch (error) {
        console.log(`Error verifying user: ${error}`);
        responderMiddleware.successResponse(res, 500, false, "Server had an error authenticating you");
    };
};

const deleteField = (req, res, next) => {
    const {username} = req.params;
    if (!username) return responderMiddleware.successResponse(res, 401, false, "Missing data to delete user");
    next();
};

const deleteCheck = async (req, res, next) => {
    const token = jwt.verify(req.cookies.authToken, process.env.JWT_SECRET);
    try {
        const usr = await user.findOne({username: token.username});
        if (!usr || usr.admin !== true) return responderMiddleware.successResponse(res, 403, false, "You do not have access to this");
        next();
    } catch (error) {
        console.log(`Error verifying user: ${error}`);
        responderMiddleware.successResponse(res, 500, false, "Server had an error authenticating you");
    }
}

// Exports
module.exports = {
    hasToken,
    noToken,
    signupFields,
    loginFields,
    userField,
    updateField,
    updateCheck,
    deleteField,
    deleteCheck,
};
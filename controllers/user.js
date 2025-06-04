// Dependencies
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {user} = require("../models/user");
const responderMiddleware = require("../middlewares/responder");

// Function

const login = async(req, res) => {
    const {email, password} = req.body;
    try {
        const existingUser = await user.findOne({email: email});
        if (!existingUser) return responderMiddleware.successResponse(res, 401, false, "Request data invalid");
        const matching = await bcrypt.compare(password, existingUser.password);
        if (matching !== true) return responderMiddleware.successResponse(res, 401, false, "Request data invalid");
        const token = jwt.sign({username: existingUser.username, email: existingUser.email}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.cookie("authToken", token, {
            maxAge: 1000 * 60 * 60, // 1 Hour
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        })
        responderMiddleware.successResponse(res, 200, true, "You were logged in successfully");
    } catch (error) {
        console.log(`Error logging in: ${error}`);
    };
}

const signup = async (req, res, next) => {
    const {username, email, password} = req.body;
    try {
        const hash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
        const newUser = await user.create({
            username: username,
            email: email,
            password: hash,
            admin: false,
        });
        if (!newUser) return responderMiddleware.successResponse(res, 500, false, "Server had a problem with this");
        responderMiddleware.successResponse(res, 201, true, `Account ${username} created`);
    } catch (error) {
        console.log(`Error signing up: ${error}`);
        responderMiddleware.successResponse(res, 500, false, "Server encountered an error creating user");
    };
};

const getUser = async (req, res) => {
    const {username} = req.params;
    try {
        const usr = await user.findOne({username: username});
        if (!usr) return responderMiddleware.successResponse(res, 204, false, "No users could be found");
        responderMiddleware.successResponse(res, 200, true, "User found", usr);

    } catch (error) {
        console.log(`Error fetching user: ${error}`);
        responderMiddleware.successResponse(res, 500, false, "Server encountered an error fetching user");
    };
};

const getUsers = async (req, res) => {
    try {
        const users = await user.find();
        if (!users && users.length === 0) return responderMiddleware.successResponse(res, 204, false, "No users could be found");
        let u = []
        users.forEach((usr) => {
            const entry = {
                "username": usr.username,
            };
            u.push(entry)
        });
        responderMiddleware.successResponse(res, 200, true, "Users found", u);
    } catch (error) {
        console.log(`Error fetching users: ${error}`);
        responderMiddleware.successResponse(res, 500, false, "Server encountered an error fetching users");
    };
};

const updateUser = async (req, res) => {
    const token = jwt.verify(req.cookies.authToken, process.env.JWT_SECRET)
    const {username} = req.params;
    let {data} = req.body;
    try {
        if (data.password) {
            const hash = await bcrypt.hash(data.password, Number(process.env.SALT_ROUNDS)); 
            data.password = hash;
        };
        const usr = await user.findOneAndUpdate(
            {username: username},
            data,
            {new: true},
        );
        if (!usr) return responderMiddleware.successResponse(res, 500, false, "Server encountered an error for updating user");
        if (token.username === username) {
            res.clearCookie('authToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict'
            });
            const token = jwt.sign({username: usr.username, email: usr.email}, process.env.JWT_SECRET, {expiresIn: "1h"});
            res.cookie("authToken", token, {
                maxAge: 1000 * 60 * 60, // 1 Hour
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict"
            });
        };
        responderMiddleware.successResponse(res, 201, true, "User has been updated", usr);
    } catch (error) {
        console.log(`Could not update user: ${error}`);
        responderMiddleware.successResponse(res, false, 500, "Server encountered an error updating user")
    };
};

const deleteUser = async (req, res) => {
    const {username} = req.params;
    try {
        const deleted = await user.findOneAndDelete(
            {username: username},
        );
        if (!deleted) return responderMiddleware.successResponse(res, 500, false, "Server encountered an error for deleting user");
        responderMiddleware.successResponse(res, 200, true, "User has been deleted");
    } catch (error) {
        console.log(`Could not update user: ${error}`);
        responderMiddleware.successResponse(res, 500, false, "Server encountered an error deleting user")
    };
};


module.exports = {
    login,
    signup,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
};
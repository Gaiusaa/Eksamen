const express = require("express");
const router = express.Router();

const authenticateMiddleware = require("../middlewares/authenticate");
const userController = require("../controllers/user");

router.post("/auth", authenticateMiddleware.noToken, authenticateMiddleware.loginFields, userController.login)
router.post("/createUser", authenticateMiddleware.noToken, authenticateMiddleware.signupFields, userController.signup);
router.get("/:username", authenticateMiddleware.userField, userController.getUser);
router.get("/users", authenticateMiddleware.hasToken, userController.getUsers);
router.put("/users/:username", authenticateMiddleware.hasToken, authenticateMiddleware.updateField, authenticateMiddleware.updateCheck, userController.updateUser);
router.delete("/users/:username", authenticateMiddleware.hasToken, authenticateMiddleware.deleteField, authenticateMiddleware.deleteCheck, userController.deleteUser);

module.exports = router;
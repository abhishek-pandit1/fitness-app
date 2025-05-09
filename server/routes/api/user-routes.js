const router = require("express").Router();
const { createUser, login, getSingleUser, updateUser } = require("../../controllers/user-controller");

// import middleware
const { authMiddleware } = require("../../utils/auth");

// put authMiddleware anywhere we need to send a token for verification of user
// /api/user for user signup
router.route("/").post(createUser)

// /api/user/login for user login
router.route("/login").post(login);

// /api/user/me to get single user data
router.route('/me').get(authMiddleware, getSingleUser);

// /api/user/update to update user password
router.route('/update').put(authMiddleware, updateUser);

module.exports = router;

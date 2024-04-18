const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/signup", authMiddleware.createUser);
router.post("/login", authMiddleware.loginUser);

module.exports = router;

const router = require("express").Router();
const activateControlers = require("../controlers/activate-controlers");
const auhtControler = require("../controlers/auth-controler");
const authMiddleware = require("../middlewares/auth-middleware");
const roomsControler = require("../controlers/room-controler");

router.post("/api/send-otp", auhtControler.sentOtp);
router.post("/api/verify-otp", auhtControler.verifyOtp);
router.post("/api/activate", authMiddleware, activateControlers.activate);
router.get("/api/refresh", auhtControler.refresh);
router.post("/api/logout", authMiddleware, auhtControler.logout);

// room
router.post("/api/rooms", authMiddleware, roomsControler.create);
router.get("/api/rooms", authMiddleware, roomsControler.index);

// intercetptors

module.exports = router;

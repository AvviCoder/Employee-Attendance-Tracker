// const express = require("express");
// const router = express.Router();

// const {checkIn, checkOut, getAttendanceHistory} = require("../Controllers/attendanceController");

// router.post("/checkin", checkIn);
// router.post("/checkOut", checkOut);
// router.get("/getAttendanceHistory", getAttendanceHistory);

// module.exports = router;



const express = require("express");
const { checkIn, checkOut, getAttendanceHistory } = require("../Controllers/attendanceController");

module.exports = (io) => {
    const router = express.Router();

    // Pass io to each controller function as a parameter
    router.post("/checkin", (req, res) => checkIn(req, res, io));
    router.post("/checkout", (req, res) => checkOut(req, res, io));
    router.get("/getAttendanceHistory", (req, res) => getAttendanceHistory(req, res, io));

    return router; 
};

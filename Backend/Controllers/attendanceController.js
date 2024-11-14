const Attendance = require("../Models/Attendance");
const cron = require("node-cron");
const Employee = require("../Models/Employee");
const { checkout } = require("../Routes/authRoutes");
// exports.checkIn = async(req, res) => {
//     try{
//         const {employeeId} = req.body;
//         const today = new Date().setHours(0,0,0,0);  // current day with midnight time 00.00hrs
        
//         const attendance = await Attendance.findOne({employeeId, date:today}); // checking for employee record for today

//         if(!attendance)
//         {
//             attendance = new Attendance({
//                 employeeId,
//                 date: today,
//                 status:'Present',
//                 sessions:[{checkIn: new Date()}],
//             });
//         }else{
//              attendance.sessions.push({checkIn: new Date()});
//              attendance.status = 'Present';
//         }

//         await attendance.save();
//         res.json({success:true,
//         message:"Employee Successfully CheckedIn", CheckInTime: attendance.sessions[attendance.sessions.length - 1]});

//     }catch(error)
//     {   
//         res.status(500).json({success:false,
//         message:"Unable to checkin with the user"});
//     }
// }


// checkIn = async (req, res, io) => {
//     try {
//         const { employeeId } = req.body;
//         const today = new Date().setHours(0, 0, 0, 0);
//         const employee = await Employee.findById({employeeId}); 

//         if(!employee)
//         {
//             return res.status(401).json({
//                 message:"No employee with Given id found",
//             })
//         }

//         const empID = employee.employeeId;

//         let attendance = await Attendance.findOne({ empID, date: today });

//         if (!attendance) {
//             attendance = new Attendance({
//                 employeeId,
//                 date: today,
//                 status: 'Present',
//                 sessions: [{ checkIn: new Date() }],
//             });
//         } else {
//             attendance.sessions.push({ checkIn: new Date() });
//             attendance.status = 'Present';
//         }

//         await attendance.save();   

//         // Emit real-time check-in event
//         io.emit('attendance-update', {
//             message: `Employee ${employeeId} successfully checked in`,
//             time: attendance.sessions[attendance.sessions.length - 1].checkIn,
//             empID,
//             status: 'Present',
//         });

//         res.status(201).json({
//             success: true,
//             message: "Employee successfully checked in",
//             checkInTime: attendance.sessions[attendance.sessions.length - 1].checkIn,
//         });
//     } catch (error) {
//         console.error(error); // Log the error
//         res.status(500).json({
//             success: false,
//             message: "Unable to check in the employee",
//         });
//     }
// };

const mongoose = require('mongoose');  // Import mongoose

const checkIn = async (req, res, io) => {
    try {
        const { employeeId } = req.body;

        // Check if employeeId exists and is not undefined or empty
        if (!employeeId || employeeId === 'undefined') {
            return res.status(404).json({
                success: false,
                message: "Employee ID is missing or invalid",
            });
        }

        // Check if employeeId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Employee ID format",
            });
        }

        const today = new Date().setHours(0, 0, 0, 0); // Reset time to midnight for date comparison

        // Find employee using the ObjectId
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        // Find or create attendance record
        let attendance = await Attendance.findOne({ employeeId, date: today });

        if (!attendance) {
            attendance = new Attendance({
                employeeId,
                date: today,
                status: 'Present',
                sessions: [{ checkIn: new Date() }],
            });
        } else {
            attendance.sessions.push({ checkIn: new Date() });
            attendance.status = 'Present';
        }

        await attendance.save();

        // Emit real-time check-in event
        io.emit('attendance-update', {
            message: `Employee ${employeeId} successfully checked in`,
            time: attendance.sessions[attendance.sessions.length - 1].checkIn,
            employeeId,
            status: 'Present',
        });

        // Respond to the client
        res.status(201).json({
            success: true,
            message: "Employee successfully checked in",
            checkInTime: attendance.sessions[attendance.sessions.length - 1].checkIn,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to check in the employee",
        });
    }
};


const checkOut = async (req, res, io) => {
    try {
        const { employeeId } = req.body;
        const today = new Date().setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({ employeeId, date: today });

        if (!attendance) {
            return res.status(400).json({
                success: false,
                message: "No check-in records found to be checked out",
            });
        }

        const latestSession = attendance.sessions[attendance.sessions.length - 1];

        if (latestSession && !latestSession.checkOut) {
            latestSession.checkOut = new Date();
            await attendance.save();

            // Emit real-time check-out event
            io.emit('attendance-update', {
                message: `Employee ${employeeId} successfully checked out`,
                time: latestSession.checkOut,
                employeeId,
                status: 'Checked Out',
            });

            res.status(200).json({
                success: true,
                message: "Employee successfully checked out",
                checkOutTime: latestSession.checkOut,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "No check-in record left to check out",
            });
        }
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({
            success: false,
            message: "Unable to log out the employee",
        });
    }
};

//CHECKOUT CONTROLLER IS CREATED AS FOLLOWS
// exports.checkOut = async(req,res) => {
//      try{
//         const {employeeId} = req.body;
//         const today = new Date().setHours(0,0,0,0);

//         const attendance = await Attendance.findOne({employeeId, date:today});

//         if(!attendance)
//         {
//              res.status(400).json({
//               message:"No checkIn records found to be checked out",
//              })
//         }
        
//         // if the sessions are present let's get the latest session
//         const latestSession = attendance.sessions[attendance.sessions.length -1];

//         // checking for latestSession with only CheckIns and still open for checkout
//         if(!latestSession && !latestSession.checkOut)
//         {
//              latestSession.checkOut = new Date();
//              await attendance.save();

//              res.status(200).json({
//                 success:true,
//                 message:"Employee successfully logged Out", checkOutTime: latestSession.checkOut,
//              })
//         }
//         else{
//             res.status(404).json({
//                 success:false,
//                 message:"No Checkin record left to be Checkout",
//             })
//         }

//      }catch(error)
//      {
//              res.status(500).json({
//                 success:false,
//                 message:"Employee Unable to logout",
//              })
//      }
// }

// LET'S GET THE COMPLETE CHECK LOGS FOR AN EMPLOYEE
const getAttendanceHistory = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const History = await Attendance.find({ employeeId }).sort({ date: -1 }); // get the latest check-in first

        if (!History || History.length === 0) {
            return res.status(402).json({
                success: false,
                message: "No Previous attendance history found for the employee",
            });
        }

        res.status(200).json({
            success: true,
            message: "Attendance history fetched successfully",
            history: History,  // Send the fetched history as part of the response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to fetch the attendance history for the employee",
        });
    }
};


// LET'S PUSH THE AUTO ABSENTING MECHANISM
// async function autoMarkAbsent() {
//      try{
//         const today = new Date().setHours(0,0,0,0);

//         const employees = await Employee.find({}); // gets all the list of employees registered

//         for(let employee of employees)  // looping through all the elements and creating the record
//         {
//             const attendanceRecord = await Attendance.findOne({
//                 employeeId:employee._id,  // why not employeeID is used to be seen??????????????
//                 date:today,
//             });
            
//             if(!attendanceRecord)  //if for a employee no record is found than an absent entry will be created
//             {
//                 const newAttendance = new Attendance({
//                     employeeId: employee._id,
//                     date:today,
//                     sessions: [],
//                     status:'Absent',
//                 });
//                 await newAttendance.save();
//             }
//         }

//         console.log("auto-Mark absent job done successfully");
//      }catch(error)
//      {   
//         console.error(
//             "Auto-mark absent job was unsuccessfully",
//         )

//      }
// };

// module.exports = {autoMarkAbsent};

async function autoMarkAbsent(io) {
    try {
        const today = new Date().setHours(0, 0, 0, 0);
        const employees = await Employee.find({});

        for (let employee of employees) {
            const attendanceRecord = await Attendance.findOne({
                employeeId: employee._id,
                date: today,
            });

            if (!attendanceRecord) {
                const newAttendance = new Attendance({
                    employeeId: employee._id,
                    date: today,
                    sessions: [],
                    status: 'Absent',
                });
                await newAttendance.save();

                // Emit real-time absence event
                io.emit('attendance-update', {
                    message: `Employee ${employee._id} marked as absent`,
                    date: today,
                    employeeId: employee._id,
                    status: 'Absent',
                });
            }
        }

        console.log("Auto-mark absent job completed successfully");
    } catch (error) {
        console.error("Auto-mark absent job failed", error);
    }
}

module.exports = {checkIn, checkOut, getAttendanceHistory, autoMarkAbsent};

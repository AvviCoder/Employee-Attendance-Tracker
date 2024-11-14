// const mongoose = require("mongoose");

// const attendanceSchema = new Schema({
//     employeeId:{
//         type: mongoose.Schema.Types.ObjectId,
//         required:true,
//         ref:"Employee",
//     },
//     date:{
//         type:Date,
//         required:true,
//         default: () => new Date().setHours(0, 0, 0, 0),   // rest to 00.00 fro tracking the daily 
//     },
//     checkIn:{
//         type:Date,
//         default:null,
//     },
//     checkOut:{
//         type:Date,
//         default:null,
//     },
//     status:{
//         type:String,
//         enum:['Present', 'Absent'],
//         default:'Absent',
//     },
// });

// module.exports = mongoose.model("Attendance", attendanceSchema);

const mongoose = require("mongoose");
const Employee = require("./Employee");

const sessionSchema = new mongoose.Schema({
    checkIn:{
        type:Date,
        required:true,
    },
    checkOut:{
        type:Date,
        default:null
    },
});

const attendanceSchema =  new mongoose.Schema({
    employeeId:{
         type:mongoose.Schema.Types.ObjectId,
         required:true,
         ref:"Employee",
    },
    date:{
         type:Date,
         required:true,
         default:() => new Date().setHours(0,0,0,0),
    },
    sessions: [sessionSchema],  // this array is capable of storing the multiple checkins/checkOuts of an employee
    status:{
        type:String,
        enum:['Present', 'Absent'],
        default:'Absent',
    },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employeeSchema = new mongoose.Schema({
    name:{type:String, required:true},
    employeeId:{type:String, required:true, unique:true},
    role:{type:String, enum:['employee', 'manager'], required: true},
    password:{type:String, required:true}
})

employeeSchema.pre("save", async function(next){
    if(!this.isModified('password')) return next();
    else{
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
})


module.exports = mongoose.model("Employee", employeeSchema);
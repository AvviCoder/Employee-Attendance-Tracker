const Employee = require("../Models/Employee")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const Login = async (req, res) => {
    const { employeeId, password } = req.body;
    const trimpassword = password.trim();

    try {
        // Find employee by employeeId
        const employee = await Employee.findOne({ employeeId });
        console.log("employee found ", employee);

        // If employee is not found, return an error response
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        // Compare the input password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(trimpassword, employee.password);
        console.log("entered password :", trimpassword);
        console.log("hashedpassword in the db :", employee.password);
        console.log("entered Password correct or not: ", isPasswordValid); 

        // If the password is incorrect, return an error response
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate JWT token for the user
        const token = jwt.sign({ id: employee._id, role: employee.role }, process.env.JWT_SECRET, {
            expiresIn: '1d', // Token expiration time
        });
        console.log("Here's the token generated:", token);

        // Return success response with the token
        return res.json({
            success: true,
            message: "Login successful",
            token, // Send JWT token in the response
        });
    } catch (error) {
        // Catch any unexpected errors
        console.error("Error during login:", error); // Log the actual error
        return res.status(500).json({
            success: false,
            message: "Server error: " + error.message,
        });
    }
};

// const register = async (req, res) => {
//     const { name, employeeId, role, password } = req.body;

//     // Debugging log to ensure data is received correctly
//     console.log('Received data:', req.body);

//     // Validate input
//     if (!name || !password || !employeeId || !role) {
//         return res.status(401).json({
//             success: false,
//             message: "Please fill all the required fields.",
//         });
//     }

//     try {
//         // Check if an employee with the given employeeId already exists
//         const existingEmployee = await Employee.findOne({ employeeId });

//         if (existingEmployee) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Employee with this employeeId already exists.",
//             });
//         }

//         // Hash the password before saving it to the database
//         const hashedPassword = await bcrypt.hash(password, 10);
//         console.log("Here's the hashed password", hashedPassword);

//         // Create a new employee instance
//         const newEmployee = new Employee({
//             name,
//             employeeId,
//             role,
//             password: hashedPassword,  // Store the hashed password
//         });

//         // Save the new employee to the database
//         const dbRes = await newEmployee.save();

//         // Respond with a success message and the employee data
//         res.status(201).json({
//             success: true,
//             message: 'Employee registered successfully',
//             employee: {
//                 id: dbRes._id,
//                 name: dbRes.name,
//                 employeeId: dbRes.employeeId,
//                 role: dbRes.role
//             },
//         });
//     } catch (error) {
//         // Handle any unexpected errors
//         console.error("Error during registration:", error);
//         res.status(500).json({
//             success: false,
//             message: "Server error: " + error.message,
//         });
//     }
// };
const register = async (req, res) => {
    const { name, employeeId, role, password } = req.body;

    if (!name || !password || !employeeId || !role) {
        return res.status(401).json({
            success: false,
            message: "Please fill all the required fields.",
        });
    }

    try {
        const existingEmployee = await Employee.findOne({ employeeId });

        if (existingEmployee) {
            return res.status(400).json({
                success: false,
                message: "Employee with this employeeId already exists.",
            });
        }

        // No need to hash the password here, because the pre-save middleware handles it
        const newEmployee = new Employee({
            name,
            employeeId,
            role,
            password, // Just save the plain text password here
        });

        const dbRes = await newEmployee.save();

        res.status(201).json({
            success: true,
            message: 'Employee registered successfully',
            employee: {
                id: dbRes._id,
                name: dbRes.name,
                employeeId,  // Sending the `_id` as `employeeId`
                role: dbRes.role
            },
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message,
        });
    }
};


   module.exports = {Login, register};
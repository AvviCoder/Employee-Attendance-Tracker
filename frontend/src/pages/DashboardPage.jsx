import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DashboardPage = () => {
  const [attendance, setAttendance] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const employeeId = localStorage.getItem("employeeId"); // Fetch employeeId from localStorage

  // Debug log to check the employeeId
  console.log("Employee ID from localStorage: ", employeeId);

  // Fetch attendance data on component mount if employeeId exists
  useEffect(() => {
    if (employeeId) {
      const fetchAttendance = async () => {
        try {
          const response = await axios.get("http://localhost:4000/api/attendance/getAttendanceHistory", {
            params: { employeeId }, // Send the employeeId as a query parameter
          });
          setAttendance(response.data.history);
          toast.success("The attendance has been fetched successfully...");
        } catch (err) {
          toast.error("Error fetching attendance data");
        }
      };

      fetchAttendance();
    } else {
      toast.error("Employee ID is missing, please log in again.");
    }
  }, [employeeId]);

  const handleCheckIn = async () => {
    if (!employeeId) {
      toast.error("Employee ID not found. Please log in again.");
      return;
    }
    try {
      await axios.post("http://localhost:4000/api/attendance/checkin", { employeeId });
      setIsCheckedIn(true);
      toast.success("Checked in successfully!");
    } catch (err) {
      toast.error("Failed to check in.");
    }
  };

  const handleCheckOut = async () => {
    if (!employeeId) {
      toast.error("Employee ID not found. Please log in again.");
      return;
    }
    try {
      await axios.post("http://localhost:4000/api/attendance/checkout", { employeeId });
      setIsCheckedIn(false);
      toast.success("Checked out successfully!");
    } catch (err) {
      toast.error("Failed to check out.");
    }
  };

  return (
    <div className="dashboard">
      <h2>Employee Dashboard</h2>
      <div className="attendance-status">
        {isCheckedIn ? (
          <button onClick={handleCheckOut}>Check Out</button>
        ) : (
          <button onClick={handleCheckIn}>Check In</button>
        )}
      </div>

      <h3>Attendance History</h3>

      {/* Conditional Rendering for No Attendance History */}
      {attendance.length === 0 ? (
        <p>No attendance history found. Please check in to start your attendance record.</p>
      ) : (
        <ul>
          {attendance.map((entry) => (
            <li key={entry._id}>
              {entry.date}: {entry.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DashboardPage;

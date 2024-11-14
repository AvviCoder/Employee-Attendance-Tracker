// src/socket.js
import { io } from 'socket.io-client';

// Initialize the socket connection
const socket = io("http://localhost:4000");  // replace with your backend URL if different

export const subscribeToAttendanceUpdates = (callback) => {
  socket.on("attendance-update", callback);
};

export const unsubscribeFromAttendanceUpdates = () => {
  socket.off("attendance-update");
};

export default socket;

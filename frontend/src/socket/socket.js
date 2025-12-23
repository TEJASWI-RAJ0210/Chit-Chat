import { io } from "socket.io-client"

const socket = io("http://localhost:5000", {
  withCredentials: true,
  autoConnect: false
})
const userId = localStorage.getItem("userId");

// Tell server user is online
socket.emit("user-online", userId);

// Listen for online users list
socket.on("online-users", (users) => {
  console.log("Online users:", users);
});
// Check if a specific user is online
if (onlineUsers.includes(userId)) {
  console.log("User is ONLINE");
} else {
  console.log("User is OFFLINE");
}


export default socket
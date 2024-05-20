const io = require("socket.io")(8800, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // Handle new user addition
  socket.on("new-user-add", (newUserId) => {
    if (!newUserId) {
      console.error("Invalid user ID");
      return;
    }

    // Remove existing entry if the user is reconnecting
    activeUsers = activeUsers.filter((user) => user.userId !== newUserId);

    // Add the new user
    activeUsers.push({ userId: newUserId, socketId: socket.id });
    console.log("New User Connected", activeUsers);

    // Broadcast active users
    io.emit("get-users", activeUsers);
  });

  // send message
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("sending from socket to : ", receiverId);
    console.log("Data", data);
    if (user) {
      io.to(user.socketId).emit("receive message", data)
    }
  })

  // Handle disconnection
  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);

    // Broadcast active users
    io.emit("get-users", activeUsers);
  });
});

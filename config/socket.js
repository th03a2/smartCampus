const socket = (io) => {
  io.on("connection", (socket) => {
    console.log(`connection established by: ${socket.id}`);

    socket.on("join_room", (room) => socket.join(room));

    socket.on("logout", (roomId) => socket.to(roomId).emit("logout"));

    socket.emit("me", socket.id);

    socket.on("receive_user", (data) => {
      socket.broadcast.emit("send_user", data);
    });

    socket.on("recived_cart", (data) => {
      socket.broadcast.emit("send_cart", data);
    });

    socket.on("enrollment_desicion", (data) => {
      socket.broadcast.emit("sendToEnrollees", data);
    });

    socket.on("receive_quiz", (data) => {
      socket.broadcast.emit("send_quiz", data);
    });
  });
};

module.exports = socket;

const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/database.js');
const app = express();
const port = process.env.PORT || 3000;
var cors = require("cors");
const router = require("./routes/userRoutes");
const chatrouter = require("./routes/chatRoutes.js");
const messagerouter = require("./routes/messageRoutes.js");
const bodyParser = require('body-parser');
const path=require('path');
const corsOptions = {
  origin: `http://${process.env.FRONTEND_HOST}`,
  credentials: true,
  optionSuccessStatus: 200
};
const fileUpload=require('express-fileupload')
connectDB();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles:true
}))
app.use("/api/v1", router);
app.use("/api/v1/chat", chatrouter);
app.use("/api/v1/message", messagerouter);


const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: `http://localhost:3000`,
    credentials: true,
    optionSuccessStatus: 200
  },
});

io.on("connection", (socket) => {
  console.log("Connected to Socket.io");

  socket.on('setup', (userData) => {
    console.log("userData: ",userData);
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log("User Joined Room " + room);
  });

  socket.on('new message', (newMessageReceived) => {
    console.log(newMessageReceived);
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log('chat.users is not defined');

      socket.broadcast.emit("message received", newMessageReceived);
  });
  socket.off("setup", ()=>{
    console.log("USER DISCONNECTED");
    socket.leave(userData._id)
  })
});

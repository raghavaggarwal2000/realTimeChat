require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const connectDB = require("./config/db");
const path = require("path");
connectDB();


const app = express();


const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");


app.use(express.json());
app.use(morgan("dev"));



app.use("/user",userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);




// ----------------------------  deployement --------------------------


const __dirname1 = path.resolve();

if(process.env.NODE_ENV === "productions"){

    app.use(express.static(path.join(__dirname1, "/frontend/build")))

    app.get("*",(req,res) =>{
        res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"))
    })
}

// ----------------------------  deployement --------------------------

const PORT = process.env.PORT || 5000



const server = app.listen(PORT, (err) =>{
    if(err) throw err;
    console.log(`Server started on localhost://${PORT}`)
});

const io = require("socket.io")(server, {
    pingTimeout: 60000, // if there is no work for socket.io for 60secs it will close the connection to save the bandwidth
    cors: {
        origin: "http://localhost:3000"
    }
});


io.on("connection", (socket) =>{
    console.log(`Connected to socket.io`)

    socket.on("setup", (userData) =>{
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) =>{
        console.log("user joined room "+room)
        socket.join(room);
    });

    socket.on("typing", (room)=>{socket.in(room).emit("typing")})

    socket.on("stop typing", (room)=>{socket.in(room).emit("stop typing")})

    socket.on("new message", (newMessageReceived) =>{
        let chat = newMessageReceived.chat;

        if(!chat.users) return console.log("chat.users not defined at socket");

        chat.users.forEach(user =>{
            if(user._id == newMessageReceived.sender._id)return

            socket.in(user._id).emit("message received", newMessageReceived);
        })
    })
});

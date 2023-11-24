const express=require('express')
const app=express();
const cors=require('cors')
app.use(cors({
    origin:"*"
}))
const {addUser}=require('./utils/users')
const mongoose = require('mongoose')
const userRoute=require("./routes/userRoutes")
const server=require('http').createServer(app)
const {Server}=require('socket.io')
const io=new Server(server,{cors:{
    origin:['http://localhost:3000'],
}})


// const io=require('socket.io')(3001,{cors:{
//     origin:['http://localhost:3000'],
//     },
// })

app.use(express.json())
mongoose.set('strictQuery', false)
mongoose
    .connect("mongodb+srv://inkCrypt:9K2al4Z4QPyF01Lt@cluster-1.yv9pqws.mongodb.net/")
    .then(()=>{
        console.log("db connected")})
    .catch((err)=>console.log(err))
app.use("/users",userRoute)

server.listen(3001,()=>console.log("server running at 3001"))

io.on('connection',socket=>{
    console.log(socket.id)
    socket.on('disconnect',()=>{
        console.log(`disconnected ${socket.id}`)
    })
    socket.on('send',m=>{
        socket.broadcast.emit('recieve',m)
    })
    socket.on("Join-User",(data)=>{
        const {username,roomId}=data;
        socket.join(roomId)
        const user=addUser(data)
        socket.emit("User-Joined",{success:true,data});
    })
    socket.on("image",(data)=>{
        socket.broadcast.to(data.roomId).emit("imageres",{
            imgUrl:data.img
        })
    })
})

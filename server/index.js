import express from 'express'
import {Server} from "socket.io"

const io = new Server({
    cors:true,
});
const app = express()
const port = 8000

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const emailToSocketMapping = new Map()
const socketToEmailMapping = new Map()

io.on("connection",socket=>{
    console.log("New user connected")

    socket.on("join-room",data =>{
        const { roomId , emailId } = data
        console.log("user",emailId,"joined room",roomId);
        emailToSocketMapping.set(emailId,socket.id)
        socketToEmailMapping.set(socket.id,emailId)
        socket.join(roomId)
        socket.emit("joined-room",{roomId})
        socket.broadcast.to(roomId).emit("user-joined",{emailId})
    })

    socket.on('call-user',data=>{
        const {offer,emailId} = data;
        const fromEmail = socketToEmailMapping.get(socket.id)
        const socketId = emailToSocketMapping.get(emailId)
        socket.to(socketId).emit('incoming-call',{
            from:fromEmail,
            offer,
        })
    })
    socket.on("call-accepted",data=>{
        const {emailId,ans} = data;
        const socketId = emailToSocketMapping.get(emailId);
        socket.to(socketId).emit("call-accepted",{
            ans,
        })

    })
})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})

io.listen(8001);
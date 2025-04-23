import express from 'express'
import {Server} from "socket.io"


const io = new Server();
const app = express()
const port = 8000

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const emailToSocketMapping = new Map()

io.on("connection",socket=>{
    socket.on("join-room",data =>{
        const {roomId,emailId} = data
        console.log("user",emailId,"joined room",roomId);
        if(!emailToSocketMapping.has(emailId)){
            emailToSocketMapping.set(emailId,socket.id)
        socket.join(roomId)
        socket.broadcast.to(roomId).emit("user-joined",{emailId})
    })
})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})

io.listen(8001);
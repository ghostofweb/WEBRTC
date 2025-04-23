import express from 'express'
import Server from "socket.io"


const io = new Server();
const app = express()
const port = 8000

app.use(express.json())
app.use(express.urlencoded({extended:true}))
io.on("connection",socket=>{
    
})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})
io.listen(8001);
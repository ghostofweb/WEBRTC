import React, { useEffect, useState } from 'react'
import { useSocket } from '../providers/Socket'

const Home = () => {
  const {socket} = useSocket()
  const [email,setEmail] = useState();
  const [roomId,setRoomId] = useState()

  const handleRoomJoined = ({roomId}) => {
    console.log("joined room",roomId)
  }
  useEffect(()=>{
    socket.on("joined-room",handleRoomJoined)
  },[socket])

  const handleJoinRoom = (e) => {
    e.preventDefault()
    socket.emit("join-room",{emailId:email,roomId})
  }
  return (
    <div className='homepage-container'>
        <div className='input-container'>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder='Enter your email here' />
            <input type="text" placeholder='Enter Room Code'  value={roomId} onChange={e => setRoomId(e.target.value)} />
            <button onClick={handleJoinRoom}>Join</button>
        </div>
    </div>
  )
}

export default Home
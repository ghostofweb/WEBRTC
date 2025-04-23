import React from 'react'
import { useSocket } from '../providers/Socket'

const Home = () => {
  const {socket} = useSocket()
  socket.emit("join-room",{roomId:"1",emailId:"abc@gmail.com"})
  return (
    <div className='homepage-container'>
        <div className='input-container'>
            <input type="email" placeholder='Enter your email here' />
            <input type="text" placeholder='Enter Room Code' />
            <button>Join</button>
        </div>
    </div>
  )
}

export default Home
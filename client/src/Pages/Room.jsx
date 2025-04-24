import React, { useCallback, useEffect } from 'react'
import { useSocket } from '../providers/Socket'
import { usePeer } from '../providers/Peer'

const Room = () => {
    const {socket} = useSocket()
    const {peer,createOffer} = usePeer();

    const handleNewUserJoined = useCallback( async (data)=> {
        const {emailId} = data
        console.log("New user joined",emailId);
        const offer = await createOffer();  
        socket.emit("call-user",{
            offer,
            emailId           
        })
      },[createOffer,socket]
    )
  
    useEffect(()=>{
        socket.on('user-joined',handleNewUserJoined)
        socket.on("incoming-call",)
    },[handleNewUserJoined, socket])
  return (
    <div className='room-page-container'>
        <h1>Room page</h1>
    </div>
  )
}

export default Room
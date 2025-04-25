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
    const handleIncomingCall = useCallback((data)=>{
        const {from,offer} = data;
        console.log("Incoming call from",from);
        console.log("Offer",offer);
    })

    useEffect(()=>{
        socket.on('user-joined',handleNewUserJoined)
        socket.on("incoming-call",handleIncomingCall)
        return () =>{
            socket.off('user-joined',handleNewUserJoined)
            socket.off("incoming-call",handleIncomingCall)
        }
    },[handleNewUserJoined, socket,handleIncomingCall])


  return (
    <div className='room-page-container'>
        <h1>Room page</h1>
    </div>
  )
}

export default Room
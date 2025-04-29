import React, { useCallback, useEffect } from 'react'
import { useSocket } from '../providers/Socket'
import { usePeer } from '../providers/Peer'
import ReactPlayer from "react-player"
const Room = () => {
    const {socket} = useSocket()
    const {peer,createOffer,createAnswer,setRemoteAnswer,sendStream} = usePeer();
    const [myStream,setMyStream] = React.useState(null)
    const [remoteStream,setRemoteStream] = React.useState(null)
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
    const handleIncomingCall = useCallback(async(data)=>{
        const {from,offer} = data;
        const ans = await createAnswer(offer);
        socket.emit("call-accepted",{
            emailId:from,ans          
        })
    },[])

    const handleCallAccepted = useCallback(async(data)=>{
        const {ans} = data;
        await setRemoteAnswer(ans)
        console.log("Call accepted",ans);
    },[setRemoteAnswer])

    const getUserMediaStream = useCallback(async()=>{
      const stream = await navigator.mediaDevices.getUserMedia({
        video:true
      })
      sendStream(stream)
      setMyStream(stream)
    },[sendStream])

    useEffect(()=>{
        socket.on('user-joined',handleNewUserJoined)
        socket.on("incoming-call",handleIncomingCall)
        socket.on("call-accepted",handleCallAccepted)
        return () =>{
            socket.off('user-joined',handleNewUserJoined)
            socket.off("incoming-call",handleIncomingCall)
            socket.off("call-accepted",handleCallAccepted)
        }
    },[handleNewUserJoined, socket,handleIncomingCall,handleCallAccepted])

    useEffect(()=>{
      getUserMediaStream()
    },[getUserMediaStream])
  return (
    <div className='room-page-container'>
        <h1>Room page</h1>
        <ReactPlayer
        url={myStream}
        playing
        controls
        />
    </div>
  )
}

export default Room
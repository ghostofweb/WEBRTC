import React, { useMemo } from "react";

const PeerContext = React.createContext();

export const usePeer = () => {
   return React.useContext(PeerContext);
}

export const PeerProvider = (props) =>{
    const peer = useMemo(()=>{
        return new RTCPeerConnection({
            iceServers:[
                {
                    urls:[
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478",
                    ]
                }
            ]
        })
    },[]);

    const createOffer = async ()=>{
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    }
    
    const createAnswer = async (offer)=>{
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        return answer;
    }

    const setRemoteAnswer = (ans) =>{
        peer.setRemoteDescription(ans);
    }

    const sendStream = async(stream)=>{
        const tracks = stream.getTracks();
        for(const track of tracks){
            peer.addTrack(track,stream);
        }
    }
    return (
        <PeerContext.Provider value={{peer,createOffer,createAnswer,setRemoteAnswer,sendStream}}>
            {props.children}
        </PeerContext.Provider>
    )
}


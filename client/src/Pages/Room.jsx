import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSocket } from '../providers/Socket';
import { usePeer } from '../providers/Peer';

const Room = () => {
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream } = usePeer();

  const [myStream, setMyStream] = React.useState(null);
  const [remoteEmailId, setRemoteEmailId] = React.useState(null);
  const [isStreamSent, setIsStreamSent] = useState(false); // Track if stream is sent
  const [isNegotiating, setIsNegotiating] = useState(false); // Prevent multiple offers

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log('New user joined:', emailId);
      try {
        setIsNegotiating(true);
        const offer = await createOffer(myStream); // Pass myStream
        console.log('Sending offer to:', emailId);
        socket.emit('call-user', { offer, emailId });
        setRemoteEmailId(emailId);
      } catch (error) {
        console.error('Error creating offer:', error);
      } finally {
        setIsNegotiating(false);
      }
    },
    [createOffer, socket, myStream]
  );

  const handleIncomingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log('Incoming call from:', from);
      if (isNegotiating) {
        console.log('Ignoring incoming call, negotiation in progress');
        return;
      }
      try {
        setIsNegotiating(true);
        const ans = await createAnswer(offer);
        console.log('Sending answer to:', from);
        socket.emit('call-accepted', { emailId: from, ans });
        setRemoteEmailId(from);
      } catch (error) {
        console.error('Error handling incoming call:', error);
      } finally {
        setIsNegotiating(false);
      }
    },
    [createAnswer, socket, isNegotiating]
  );

  const handleCallAccepted = useCallback(
    async (data) => {
      const { ans } = data;
      console.log('Received answer');
      if (isNegotiating) {
        console.log('Ignoring answer, negotiation in progress');
        return;
      }
      try {
        setIsNegotiating(true);
        await setRemoteAnswer(ans);
        console.log('Set remote answer successfully');
      } catch (error) {
        console.error('Error setting remote answer:', error);
      } finally {
        setIsNegotiating(false);
      }
    },
    [setRemoteAnswer, isNegotiating]
  );

  const getUserMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setMyStream(stream);
      console.log('My stream video tracks:', stream.getVideoTracks().length);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  }, []);

  const handleNegotiation = useCallback(async () => {
    if (isNegotiating || !remoteEmailId) {
      console.log('Skipping negotiation: in progress or no remoteEmailId');
      return;
    }
    try {
      setIsNegotiating(true);
      const offer = await createOffer();
      console.log('Negotiation needed, sending offer to:', remoteEmailId);
      socket.emit('call-user', { offer, emailId: remoteEmailId });
    } catch (error) {
      console.error('Error during negotiation:', error);
    } finally {
      setIsNegotiating(false);
    }
  }, [createOffer, remoteEmailId, socket, isNegotiating]);

  useEffect(() => {
    peer.addEventListener('negotiationneeded', handleNegotiation);
    return () => {
      peer.removeEventListener('negotiationneeded', handleNegotiation);
    };
  }, [peer, handleNegotiation]);

  useEffect(() => {
    socket.on('user-joined', handleNewUserJoined);
    socket.on('incoming-call', handleIncomingCall);
    socket.on('call-accepted', handleCallAccepted);

    return () => {
      socket.off('user-joined', handleNewUserJoined);
      socket.off('incoming-call', handleIncomingCall);
      socket.off('call-accepted', handleCallAccepted);
    };
  }, [handleNewUserJoined, socket, handleIncomingCall, handleCallAccepted]);

  useEffect(() => {
    peer.onicecandidate = (e) => {
      if (e.candidate && remoteEmailId) {
        console.log('Sending ICE candidate:', e.candidate);
        socket.emit('ice-candidate', {
          to: remoteEmailId,
          candidate: e.candidate,
        });
      } else if (!e.candidate) {
        console.log('ICE candidate gathering complete');
      }
    };
  
    socket.on('ice-candidate', async ({ candidate }) => {
      try {
        console.log('Received ICE candidate:', candidate);
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('Added remote ICE candidate');
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    });
  }, [peer, socket, remoteEmailId]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  useEffect(() => {
    if (localVideoRef.current && myStream) {
      localVideoRef.current.srcObject = myStream;
      console.log('Set local video srcObject');
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      console.log('Set remote video srcObject');
    }
  }, [myStream, remoteStream]);

  return (
    <div className="room-page-container">
      <h1>Room page</h1>
      <h4>You are connected to {remoteEmailId}</h4>
      <button
        onClick={(e) => {
          e.preventDefault();
          if (myStream && !isStreamSent) {
            sendStream(myStream);
            setIsStreamSent(true);
            console.log('Sending my stream, tracks added:', myStream.getTracks().length);
          } else if (isStreamSent) {
            console.log('Stream already sent');
          } else {
            console.error('No stream to send');
          }
        }}
      >
        Send my video
      </button>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <h5>My Video</h5>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{ width: '300px', height: '200px', border: '1px solid black' }}
          />
        </div>
        <div>
          <h5>Remote Video</h5>
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{ width: '300px', height: '200px', border: '1px solid black' }}
            />
          ) : (
            <p>Waiting for remote video...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const PeerContext = React.createContext();

export const usePeer = () => {
  return React.useContext(PeerContext);
};

export const PeerProvider = (props) => {
  const [remoteStream, setRemoteStream] = useState(null);
  const peer = useMemo(() => {
    return new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:global.stun.twilio.com:3478',
          ],
        },
        {
          urls: 'turn:openrelay.metered.ca:80',
          username: 'openrelayproject',
          credential: 'openrelayproject',
        },
      ],
    });
  }, []);

  const createOffer = async (stream) => {
    if (stream) {
      await sendStream(stream);
    }
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    console.log('Created offer SDP:', offer.sdp);
    return offer;
  };
  
  const createAnswer = async (offer) => {
    console.log('Received offer SDP:', offer.sdp);
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    console.log('Created answer SDP:', answer.sdp);
    return answer;
  };

  const setRemoteAnswer = async (ans) => {
    await peer.setRemoteDescription(ans);
    console.log('Set remote answer:', ans);
  };

  const sendStream = async (stream) => {
    const tracks = stream.getTracks();
    for (const track of tracks) {
      try {
        peer.addTrack(track, stream);
        console.log('Added track:', track.kind, track.id);
      } catch (error) {
        console.error('Error adding track:', track.kind, error);
      }
    }
  };

  const handleTrackEvent = useCallback((e) => {
    console.log('Track event received, streams:', e.streams.length, 'tracks:', e.streams[0]?.getTracks());
    if (e.streams && e.streams[0]) {
      setRemoteStream(e.streams[0]);
    } else {
      console.warn('No streams received in track event');
    }
  }, []);

  useEffect(() => {
    peer.addEventListener('track', handleTrackEvent);
    return () => {
      peer.removeEventListener('track', handleTrackEvent);
    };
  }, [peer, handleTrackEvent]);

  return (
    <PeerContext.Provider value={{ peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream }}>
      {props.children}
    </PeerContext.Provider>
  );
};
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import socket from "../../socket/socket.js";

const rtcConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun.cloudflare.com:3478" },
  ],
};

const VideoCall = () => {
  const { id: peerId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const role = state?.role;
  const callId = state?.callId;
  const chatId = state?.chatId;
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  const startedRef = useRef(false);
  const [status, setStatus] = useState("Connecting call…");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!peerId || !callId || !chatId || !["caller", "callee"].includes(role)) {
      setError("Call details are missing. Return to your chats and start a new call.");
      return undefined;
    }
    if (!window.RTCPeerConnection) {
      setError("This browser does not support video calling.");
      return undefined;
    }

    let disposed = false;
    const peerConnection = new RTCPeerConnection(rtcConfiguration);
    peerConnectionRef.current = peerConnection;

    const flushCandidates = async () => {
      if (!peerConnection.remoteDescription) return;
      const queued = pendingCandidatesRef.current.splice(0);
      await Promise.all(queued.map((candidate) => peerConnection.addIceCandidate(candidate)));
    };

    const handleOffer = async ({ callId: incomingCallId, offer }) => {
      if (incomingCallId !== callId || role !== "callee" || !offer) return;
      try {
        await peerConnection.setRemoteDescription(offer);
        await flushCandidates();
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit("answer", { callId, answer: peerConnection.localDescription });
        setStatus("Connecting…");
      } catch (callError) {
        console.error("Could not answer call:", callError);
        setError("Could not connect the call. Please hang up and try again.");
      }
    };

    const handleAnswer = async ({ callId: incomingCallId, answer }) => {
      if (incomingCallId !== callId || role !== "caller" || !answer) return;
      try {
        await peerConnection.setRemoteDescription(answer);
        await flushCandidates();
        setStatus("Connecting…");
      } catch (callError) {
        console.error("Could not apply call answer:", callError);
        setError("Could not connect the call. Please hang up and try again.");
      }
    };

    const handleCandidate = async ({ callId: incomingCallId, candidate }) => {
      if (incomingCallId !== callId || !candidate) return;
      try {
        if (peerConnection.remoteDescription) {
          await peerConnection.addIceCandidate(candidate);
        } else {
          pendingCandidatesRef.current.push(candidate);
        }
      } catch (callError) {
        console.error("Could not add network candidate:", callError);
      }
    };

    const handlePeerReady = async ({ callId: readyCallId }) => {
      if (readyCallId !== callId || role !== "caller" || startedRef.current) return;
      startedRef.current = true;
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("offer", { callId, offer: peerConnection.localDescription });
      } catch (callError) {
        console.error("Could not start call negotiation:", callError);
        setError("Could not start the call. Please hang up and try again.");
      }
    };

    const handleCallEnded = ({ callId: endedCallId }) => {
      if (endedCallId !== callId) return;
      navigate("/chat");
    };

    peerConnection.ontrack = ({ streams }) => {
      if (remoteVideoRef.current && streams[0]) {
        remoteVideoRef.current.srcObject = streams[0];
      }
      setStatus("Call connected");
    };

    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) socket.emit("ice-candidate", { callId, candidate });
    };

    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === "connected") setStatus("Call connected");
      if (peerConnection.connectionState === "disconnected") setStatus("Connection interrupted. Trying to reconnect…");
      if (peerConnection.connectionState === "failed") {
        setError("A direct connection could not be established. A TURN relay may be required on this network.");
      }
    };

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleCandidate);
    socket.on("call-peer-ready", handlePeerReady);
    socket.on("call-ended", handleCallEnded);

    const startCall = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera and microphone access requires HTTPS and a supported browser.");
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        if (disposed) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
        setStatus("Waiting for the other person…");
        socket.emit("call-ready", { callId });
      } catch (mediaError) {
        console.error("Could not access camera or microphone:", mediaError);
        setError(mediaError.message || "Camera or microphone access was denied.");
      }
    };

    startCall();

    return () => {
      disposed = true;
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleCandidate);
      socket.off("call-peer-ready", handlePeerReady);
      socket.off("call-ended", handleCallEnded);
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      peerConnection.close();
      peerConnectionRef.current = null;
    };
  }, [peerId, callId, chatId, role, navigate]);

  const hangUp = () => {
    socket.emit("end-call", { callId });
    navigate("/chat");
  };

  return (
    <div className="h-screen bg-black flex flex-col justify-center items-center gap-5 p-6">
      <p className="text-white text-sm">{error || status}</p>
      <div className="relative w-full max-w-5xl flex items-center justify-center">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full max-h-[75vh] rounded-xl bg-gray-900 object-contain"
        />
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-4 right-4 w-44 max-h-36 rounded-xl bg-gray-800 object-cover"
        />
      </div>
      <button
        type="button"
        onClick={hangUp}
        className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-700"
      >
        End call
      </button>
    </div>
  );
};

export default VideoCall;

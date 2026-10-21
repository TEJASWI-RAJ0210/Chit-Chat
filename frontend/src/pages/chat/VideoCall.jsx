import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Maximize2,
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
} from "lucide-react";
import socket from "../../socket/socket.js";

const rtcConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun.cloudflare.com:3478" },
  ],
};

const formatDuration = (seconds) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

const VideoCall = () => {
  const { id: peerId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const role = state?.role;
  const callId = state?.callId;
  const chatId = state?.chatId;
  const peerName = state?.peerName || `ChitChat contact`;
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  const startedRef = useRef(false);
  const callStartedAtRef = useRef(null);
  const [status, setStatus] = useState("Connecting call…");
  const [error, setError] = useState("");
  const [hasRemoteVideo, setHasRemoteVideo] = useState(false);
  const [hasLocalStream, setHasLocalStream] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [duration, setDuration] = useState(0);

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
      if (endedCallId === callId) navigate("/chat");
    };

    peerConnection.ontrack = ({ streams, track }) => {
      if (remoteVideoRef.current && streams[0]) {
        remoteVideoRef.current.srcObject = streams[0];
        if (track.kind === "video") setHasRemoteVideo(true);
      }
      setStatus("Call connected");
    };

    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) socket.emit("ice-candidate", { callId, candidate });
    };

    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === "connected") {
        callStartedAtRef.current = Date.now();
        setStatus("Call connected");
      }
      if (peerConnection.connectionState === "disconnected") {
        setStatus("Connection interrupted. Trying to reconnect…");
      }
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
        setHasLocalStream(true);
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

  useEffect(() => {
    if (status !== "Call connected") return undefined;
    const timer = window.setInterval(() => {
      if (callStartedAtRef.current) {
        setDuration(Math.floor((Date.now() - callStartedAtRef.current) / 1000));
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  const toggleMic = () => {
    const nextEnabled = !micEnabled;
    localStreamRef.current?.getAudioTracks().forEach((track) => { track.enabled = nextEnabled; });
    setMicEnabled(nextEnabled);
  };

  const toggleCamera = () => {
    const nextEnabled = !cameraEnabled;
    localStreamRef.current?.getVideoTracks().forEach((track) => { track.enabled = nextEnabled; });
    setCameraEnabled(nextEnabled);
  };

  const hangUp = () => {
    socket.emit("end-call", { callId });
    navigate("/chat");
  };

  const enterFullscreen = () => {
    document.querySelector(".video-call-shell")?.requestFullscreen?.();
  };

  return (
    <main className="video-call-shell min-h-screen h-screen overflow-hidden bg-[#0b0d12] text-white flex flex-col font-['DM_Sans',sans-serif]">
      <header className="h-[72px] shrink-0 flex items-center justify-between px-5 sm:px-8 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#00e5a0] to-[#00b87a] text-[#0f1117] grid place-items-center font-['Syne',sans-serif] font-extrabold text-xs shadow-[0_0_20px_rgba(0,229,160,.18)]">CC</div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">ChitChat video call</p>
            <p className="text-xs text-white/50 truncate">{peerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-white/75">
            <span className={`h-2 w-2 rounded-full ${status === "Call connected" ? "bg-[#00e5a0]" : "bg-amber-400 animate-pulse"}`} />
            {status === "Call connected" ? duration ? formatDuration(duration) : "Connected" : status}
          </span>
          <button type="button" onClick={enterFullscreen} aria-label="Enter full screen" title="Full screen" className="h-10 w-10 grid place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors">
            <Maximize2 size={18} />
          </button>
        </div>
      </header>

      <section className="flex-1 min-h-0 p-3 sm:p-5 lg:p-7 flex items-center justify-center">
        <div className="relative w-full h-full max-w-[1500px] max-h-[calc(100vh-150px)] overflow-hidden rounded-[28px] bg-[#171a22] border border-white/[0.07] shadow-2xl">
          <video ref={remoteVideoRef} autoPlay playsInline className={`absolute inset-0 h-full w-full object-cover transition-opacity ${hasRemoteVideo ? "opacity-100" : "opacity-0"}`} />

          {!hasRemoteVideo && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_rgba(0,229,160,0.10),_transparent_55%)]">
              <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full bg-gradient-to-br from-[#1d2730] to-[#101319] border border-white/10 grid place-items-center text-4xl sm:text-5xl font-semibold text-[#00e5a0] shadow-[0_15px_60px_rgba(0,0,0,.4)]">
                {peerName.charAt(0).toUpperCase()}
              </div>
              <p className="mt-5 text-lg font-medium">{peerName}</p>
              <p className="mt-1 text-sm text-white/50">{error ? "Call could not connect" : status}</p>
            </div>
          )}

          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-3 py-2 text-xs text-white/90 border border-white/10">
            <span className={`h-2 w-2 rounded-full ${status === "Call connected" ? "bg-[#00e5a0]" : "bg-amber-400 animate-pulse"}`} />
            <span className="max-w-[55vw] truncate">{status === "Call connected" ? `${peerName} · ${formatDuration(duration)}` : status}</span>
          </div>

          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-[clamp(112px,22vw,260px)] aspect-video overflow-hidden rounded-2xl border border-white/20 bg-[#252a33] shadow-xl">
            <video ref={localVideoRef} autoPlay playsInline muted className={`h-full w-full object-cover scale-x-[-1] ${cameraEnabled && hasLocalStream ? "" : "hidden"}`} />
            {(!cameraEnabled || !hasLocalStream) && (
              <div className="absolute inset-0 grid place-items-center text-white/45">
                <VideoOff size={22} />
              </div>
            )}
            <span className="absolute bottom-2 left-2 rounded-md bg-black/45 px-2 py-1 text-[10px] text-white/85">You</span>
          </div>

          {error && (
            <div role="alert" className="absolute bottom-4 left-4 right-[calc(clamp(112px,22vw,260px)+2rem)] sm:bottom-6 sm:left-6 sm:right-[calc(clamp(112px,22vw,260px)+3rem)] rounded-xl border border-red-300/20 bg-red-950/70 backdrop-blur px-3 py-2 text-xs sm:text-sm text-red-100">
              {error}
            </div>
          )}
        </div>
      </section>

      <footer className="h-[92px] shrink-0 flex items-center justify-center gap-3 sm:gap-5 px-4 pb-3">
        <button type="button" onClick={toggleMic} disabled={!hasLocalStream} aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"} title={micEnabled ? "Mute microphone" : "Unmute microphone"} className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full grid place-items-center transition-colors disabled:opacity-40 ${micEnabled ? "bg-[#252a33] hover:bg-[#343a46]" : "bg-white text-[#14171d] hover:bg-gray-200"}`}>
          {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
        </button>
        <button type="button" onClick={toggleCamera} disabled={!hasLocalStream} aria-label={cameraEnabled ? "Turn camera off" : "Turn camera on"} title={cameraEnabled ? "Turn camera off" : "Turn camera on"} className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full grid place-items-center transition-colors disabled:opacity-40 ${cameraEnabled ? "bg-[#252a33] hover:bg-[#343a46]" : "bg-white text-[#14171d] hover:bg-gray-200"}`}>
          {cameraEnabled ? <Video size={20} /> : <VideoOff size={20} />}
        </button>
        <button type="button" onClick={hangUp} aria-label="End call" title="End call" className="h-12 w-[68px] sm:h-14 sm:w-[76px] rounded-full grid place-items-center bg-[#e94258] hover:bg-[#d83349] transition-colors shadow-[0_8px_28px_rgba(233,66,88,.28)]">
          <PhoneOff size={21} />
        </button>
      </footer>
    </main>
  );
};

export default VideoCall;

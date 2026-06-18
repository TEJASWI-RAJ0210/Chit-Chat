import React, { useEffect, useRef } from "react";
import socket from "../socket/socket";
import { useParams } from "react-router-dom";

const VideoCall = () => {
  const localVideoRef = useRef(null);
  const { id: friendId } = useParams();
  const myUserId =localStorage.getItem("userId");
  console.log("My ID:", myUserId);
  console.log("Friend ID:", friendId);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject =
            stream;
        }
      } catch (err) {
        console.error(err);
      }
    };

    startCamera();
  }, []);

  useEffect(() => {
  console.log("VideoCall mounted");
  console.log("friendId:", friendId);
  console.log("myUserId:", myUserId);

  if (!friendId || !myUserId) {
    console.log("Missing IDs");
    return;
  }

  console.log("EMITTING CALL");
  console.log("Socket connected:", socket.connected);
  console.log("Socket ID:", socket.id);

  socket.emit("call-user", {
    targetUserId: friendId,
    callerId: myUserId,
  });
}, [friendId, myUserId]);

  useEffect(() => {
  socket.on("incoming-call", (data) => {
    console.log(
      "Incoming Call",
      data
    );
  });

  return () =>
    socket.off("incoming-call");
}, []);

  return (
    <div className="h-screen bg-black flex justify-center items-center">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className="w-[600px] rounded-xl"
      />
    </div>
  );
};

export default VideoCall;
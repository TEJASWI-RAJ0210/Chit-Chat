import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket, { setSocketUser } from "../../socket/socket.js";

const CallManager = () => {
  const [incomingCall, setIncomingCall] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setSocketUser(localStorage.getItem("userId"));
    const handleIncomingCall = (call) => setIncomingCall(call);
    const handleCallAccepted = ({ receiverId, callId, chatId }) => {
      navigate(`/video-call/${receiverId}`, {
        state: { role: "caller", callId, chatId },
      });
    };
    const handleCallCancelled = ({ callId }) => {
      setIncomingCall((current) => current?.callId === callId ? null : current);
    };

    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("call-cancelled", handleCallCancelled);
    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("call-cancelled", handleCallCancelled);
    };
  }, [navigate]);

  if (!incomingCall) return null;

  const accept = () => {
    socket.emit("accept-call", {
      callerId: incomingCall.callerId,
      callId: incomingCall.callId,
      chatId: incomingCall.chatId,
    });
    navigate(`/video-call/${incomingCall.callerId}`, {
      state: { role: "callee", callId: incomingCall.callId, chatId: incomingCall.chatId },
    });
    setIncomingCall(null);
  };

  const reject = () => {
    socket.emit("reject-call", {
      callerId: incomingCall.callerId,
      callId: incomingCall.callId,
    });
    setIncomingCall(null);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl">
        <h2 className="text-xl font-bold font-['Syne',sans-serif]">Incoming Video Call</h2>
        <p className="mt-3 text-gray-500 text-sm">
          Incoming call from {incomingCall.callerName || incomingCall.callerId}
        </p>
        <div className="flex gap-4 mt-6">
          <button
            onClick={accept}
            className="flex-1 bg-green-500 text-white py-2.5 rounded-xl font-medium hover:bg-green-600 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={reject}
            className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-medium hover:bg-red-600 transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallManager;

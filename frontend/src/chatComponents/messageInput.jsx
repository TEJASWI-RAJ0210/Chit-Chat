import React from "react";
import {SendHorizontal,SmilePlus,Paperclip} from "lucide-react";
import {useState} from "react";
const MessageInput=()=>{
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSend = () => {
        if (message.trim() !== "") {
            setIsSending(true);
            // Simulate sending message
            setTimeout(() => {
                setMessage("");
                setIsSending(false);
            }, 1000);
        }
    };

    return(
        <div className="w-[1089px] h-[53px] p-3 border-r ml-[409px]" >
            <form className="flex items-center gap-2 rounded-lg border border-black bg-white px-3 py-2 shadow-md">
                <input
                    type="text"
                    placeholder="Type a new message here"
                    className="flex-grow outline-none"
                    value={message}
                    onChange={handleInputChange}
                />
                 <button className="text-gray-600 hover:text-black gap-5">
                  <Paperclip />
                  </button>
                <button className="text-gray-600 hover:text-black gap-5">
                    <SmilePlus />
                </button>
                <button className="text-gray-600 hover:text-black gap-5">
                <SendHorizontal />
                </button>
            </form>
           
        </div>
    );
}
export default MessageInput;
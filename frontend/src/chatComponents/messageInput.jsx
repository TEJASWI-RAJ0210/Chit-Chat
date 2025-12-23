import React from "react";
const MessageInput=()=>{
    return(
        <div>       
            <h1 className="text-2xl font-bold bg-blue-500 text-white p-4 rounded-lg">
                Message Input Component
            </h1>
            <button className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg">
                Send
            </button>
        </div>
    );
}
export default MessageInput;
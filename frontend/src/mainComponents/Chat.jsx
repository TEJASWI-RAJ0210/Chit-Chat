import React from "react";
import {useEffect} from "react";
import socket  from "../socket/socket.js";



useEffect(() => {
  socket.emit("joinChat", chatID);

  socket.on("receiveMessage", (msg) => {
    console.log(msg);
  });

  return () => socket.off("receiveMessage");
}, [chatID]);


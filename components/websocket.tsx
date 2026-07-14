"use client";

import { io, type Socket } from "socket.io-client";
import { KEYS } from "../utils/keys";
import { useEffect } from "react";
import { EnumWebSocketEventType } from "@/enums/web-socket-events";
import { ImageObject } from "@/entities/image-object.entity";
import { useDispatch } from "react-redux";
import { setNewImageObject } from "@/store/notification.slice";

const WebSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket: Socket = io(KEYS.WEB_SOCKET_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
    });

    socket.on(EnumWebSocketEventType.IMAGE_UPLOADED, (data: ImageObject) => {
      dispatch(setNewImageObject(data));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <></>;
};

export default WebSocket;

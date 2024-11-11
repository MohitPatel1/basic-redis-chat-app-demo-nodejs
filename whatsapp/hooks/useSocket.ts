import { Action, UserEntry } from "@/app/app-context";
import { API_BASE_URL } from "@/env";
import { parseRoomName } from "@/utils/parseRoomName";
import { Dispatch, useEffect, useRef } from "react";
import io from "socket.io-client";

const updateUser = (newUser: UserEntry, dispatch: Dispatch<Action>, infoMessage: string) => {
  dispatch({ type: "set user", payload: newUser });
  if (infoMessage !== undefined) {
    dispatch({
      type: "append message",
      payload: {
        id: "0",
        message: {
          /** Date isn't shown in the info message, so we only need a unique value */
          date: Math.random() * 10000,
          from: "info",
          message: infoMessage,
        },
      },
    });
  }
};

export const useSocket = (user: UserEntry | null, dispatch: Dispatch<Action>) => {
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const socket = socketRef.current;

  /** First of all it's necessary to handle the socket io connection */
  useEffect(() => {
    if (user === null) {
      if (socket !== null) {
        socket.disconnect();
        console.log('Socket disconnected');
      }
    } else {
      if (socket !== null) {
        socket.connect();
        console.log('Socket reconnected');
      } else {
        socketRef.current = io(API_BASE_URL, {
          transports: ['websocket'],
          upgrade: false,
          forceNew: true,
          reconnection: true,
          autoConnect: true,
          // Add your backend port here if needed
          // port: 3000,
        });
        console.log('Socket initialized with URL:', API_BASE_URL);
      }
    }

    if (socketRef.current) {
      socketRef.current.on('connect', () => console.log('Socket connected'));
      socketRef.current.on('disconnect', () => console.log('Socket disconnected'));
      socketRef.current.on('connect_error', (err) => console.error('Socket connection error:', err));
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  /**
   * Once we are sure the socket io object is initialized
   * Add event listeners.
   */
  useEffect(() => {
    if (user && socket) {
      socket.on("user.connected", (newUser) => {
        console.log("socket user.connected");
        updateUser(newUser, dispatch, `${newUser.username} connected`);
      });
      socket.on("user.disconnected", (newUser) => {
        console.log("socket user.disconnected");
        updateUser(newUser, dispatch, `${newUser.username} left`);
      });
      socket.on("show.room", (room) => {
        console.log("socket show.room");
        dispatch({
          type: "add room",
          payload: {
            id: room.id,
            name: parseRoomName(room.names, user.username),
          },
        });
      });
      console.log("socket listening for message");
      socket.on("message", (message) => {
        console.log("socket message", message);
        /** Set user online */
        dispatch({
          type: "make user online",
          payload: message.from,
        });
        dispatch({
          type: "append message",
          payload: { id: message.roomId === undefined ? "0" : message.roomId, message },
        });
      });
    } else {
      /** If there was a log out, we need to clear existing listeners on an active socket connection */
      if (socket) {
        console.log("clearing socket listeners");
        socket.off("user.connected");
        socket.off("user.disconnected");
        socket.off("user.room");
        socket.off("message");
      }
    }
  }, [user, dispatch, socket]);

  return socket;
};
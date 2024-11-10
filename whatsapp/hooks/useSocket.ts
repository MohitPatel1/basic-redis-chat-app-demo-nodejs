import { Action, UserEntry } from "@/app/app-context";
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
      }
    } else {
      if (socket !== null) {
        socket.connect();
      } else {
        socketRef.current = io();
      }
    }
  }, [user, socket]);

  /**
   * Once we are sure the socket io object is initialized
   * Add event listeners.
   */
  useEffect(() => {
    if (user && socket) {
      socket.on("user.connected", (newUser) => {
        updateUser(newUser, dispatch, `${newUser.username} connected`);
      });
      socket.on("user.disconnected", (newUser) =>
        updateUser(newUser, dispatch, `${newUser.username} left`)
      );
      socket.on("show.room", (room) => {
        console.log({ user });
        dispatch({
          type: "add room",
          payload: {
            id: room.id,
            name: parseRoomName(room.names, user.username),
          },
        });
      });
      socket.on("message", (message) => {
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
        socket.off("user.connected");
        socket.off("user.disconnected");
        socket.off("user.room");
        socket.off("message");
      }
    }
  }, [user, dispatch, socket]);

  return socket;
};
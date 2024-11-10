// @ts-check
import { getMessages } from "@/api/getMessages";
import { AppContext, UserEntry } from "@/app/app-context";
import { parseRoomName } from "@/utils/parseRoomName";
import { populateUsersFromLoadedMessages } from "@/utils/populateUsersFromLoadedMessages";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";

/** Lifecycle hooks with callbacks for the Chat component */
const useChatHandlers = (user: UserEntry) => {
  const [state, dispatch] = useContext(AppContext);
  const messageListElement = useRef<ScrollView>(null);

  /** @type {import("../../state").Room} */
  const room = state.rooms[state.currentRoom];
  const roomId = room?.id;
  const messages = room?.messages;

  const [message, setMessage] = useState("");

  const scrollToTop = useCallback(() => {
    if (messageListElement.current) {
      messageListElement.current.scrollTo({ y: 0, animated: true });
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (messageListElement.current) {
      messageListElement.current.scrollToEnd({ animated: true });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const onFetchMessages = useCallback(
    (offset = 0, prepend = false) => {
      getMessages(roomId, offset).then(async (messages) => {
        /** We've got messages but it's possible we might not have the cached user entires which correspond to those messages */
        await populateUsersFromLoadedMessages(state.users, dispatch, messages);

        dispatch({
          type: prepend ? "prepend messages" : "set messages",
          payload: { id: roomId, messages: messages },
        });
        if (prepend) {
          setTimeout(() => {
            scrollToTop();
          }, 10);
        } else {
          scrollToBottom();
        }
      });
    },
    [dispatch, roomId, scrollToBottom, scrollToTop, state.users]
  );

  useEffect(() => {
    if (roomId === undefined) {
      return;
    }
    if (messages === undefined) {
      /** Fetch logic goes here */
      onFetchMessages();
    }
  }, [
    messages,
    dispatch,
    roomId,
    state.users,
    state,
    scrollToBottom,
    onFetchMessages,
  ]);

  useEffect(() => {
    if (messageListElement.current) {
      scrollToBottom();
    }
  }, [scrollToBottom, roomId]);

  const onUserClicked = async (userId: string) => {
    /** Check if room exists. */
    const targetUser = state.users[userId];
    let roomId = targetUser.room;
    if (roomId === undefined) {
      // @ts-ignore
      const room = await addRoom(userId, user.id);
      roomId = room.id;
      /** We need to set this room id to user. */
      dispatch({ type: "set user", payload: { ...targetUser, room: roomId } });
      /** Then a new room should be added to the store. */
      dispatch({
        type: "add room",
        // @ts-ignore
        payload: { id: roomId, name: parseRoomName(room.names, user.username) },
      });
      return;
    }
    /** Then a room should be changed */
    dispatch({ type: "set current room", payload: roomId });
  };

  const onLoadMoreMessages = useCallback(() => {
    onFetchMessages(room.offset, true);
  }, [onFetchMessages, room]);

  return {
    onLoadMoreMessages,
    onUserClicked,
    message,
    setMessage,
    dispatch,
    room,
    rooms: state.rooms,
    currentRoom: state.currentRoom,
    messageListElement,
    roomId,
    users: state.users,
    messages,
  };
};
export default useChatHandlers;
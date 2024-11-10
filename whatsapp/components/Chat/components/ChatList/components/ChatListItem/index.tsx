// @ts-check
import { getMessages } from "@/api/getMessages";
import { AppContext, Message, Room } from "@/app/app-context";
import moment from "moment";
import React, { useContext, useEffect, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import OnlineIndicator from "../../../OnlineIndicator";
import AvatarImage from "../AvatarImage";

interface ChatListItemProps {
  room: Room;
  active?: boolean;
  onClick: () => void;
}

const ChatListItem = ({ room, active = false, onClick }: ChatListItemProps) => {
  const { online, name, lastMessage, userId } = useChatListItemHandlers(room);
  
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[styles.chatListItem, active && styles.activeItem]}
    >
      <View style={styles.avatarContainer}>
        <AvatarImage name={name} id={userId} />
        <View style={styles.indicatorWrapper}>
          <OnlineIndicator online={online} hide={room.id === "0"} />
        </View>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <Text style={styles.nameText} numberOfLines={1}>
            {name}
          </Text>
          {lastMessage && (
            <Text style={styles.timeText}>
              {moment.unix(lastMessage.date).format("HH:mm")}
            </Text>
          )}
        </View>
        {lastMessage && (
          <Text style={styles.messageText} numberOfLines={1}>
            {lastMessage.message}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginVertical: 1,
    borderRadius: 12,
  },
  activeItem: {
    backgroundColor: '#f0f2f5',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  indicatorWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  messageText: {
    color: '#65676b',
    fontSize: 14,
  },
  timeText: {
    fontSize: 12,
    color: '#65676b',
  },
});

const useChatListItemHandlers = (room: Room) => {
  const { id, name } = room;
  const [state] = useContext(AppContext);

  const [isUser, online, userId] = useMemo(() => {
    try {
      let pseudoUserId = Math.abs(parseInt(id.split(":").reverse().pop() || "0"));
      const isUser = pseudoUserId > 0;
      const usersFiltered = Object.entries(state.users)
        .filter(([, user]) => user.username === name)
        .map(([, user]) => user);
      let online = false;
      if (usersFiltered.length > 0) {
        online = usersFiltered[0].online || false;
        pseudoUserId = +usersFiltered[0].id;
      }
      return [isUser, online, pseudoUserId];
    } catch (_) {
      return [false, false, "0"];
    }
  }, [id, name, state.users]);

  const lastMessage = useLastMessage(room);

  return {
    isUser,
    online,
    userId,
    name: room.name,
    lastMessage,
  };
};

interface SetLastMessageAction {
  type: "set last message";
  payload: {
    id: string;
    lastMessage: Message | null;
  };
}

const useLastMessage = (room: Room) => {
  const [, dispatch] = useContext(AppContext);
  const { lastMessage } = room;
  
  useEffect(() => {
    if (lastMessage === undefined) {
      if (room.messages === undefined) {
        getMessages(room.id, 0, 1).then((messages) => {
          let message: Message | null = null;
          if (messages.length !== 0) {
            message = messages.pop() || null;
          }
          dispatch({
            type: "set last message" as const,
            payload: { id: room.id, lastMessage: message },
          });
        });
      } else if (room.messages.length === 0) {
        dispatch({
          type: "set last message",
          payload: { id: room.id, lastMessage: null },
        });
      } else {
        dispatch({
          type: "set last message",
          payload: {
            id: room.id,
            lastMessage: room.messages[room.messages.length - 1],
          },
        });
      }
    }
  }, [lastMessage, dispatch, room]);

  return lastMessage;
};

export default ChatListItem;

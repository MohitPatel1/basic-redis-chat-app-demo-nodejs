// @ts-check
import { Room, UserEntry } from "@/app/app-context";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ChatListItem from "./components/ChatListItem";
import Footer from "./components/Footer";

interface ChatListProps {
  rooms: Record<string, Room>;
  dispatch: (action: any) => void;
  user: UserEntry;
  currentRoom: string;
  onLogOut: () => void;
}

const ChatList = ({ rooms, dispatch, user, currentRoom, onLogOut }: ChatListProps) => {
  const processedRooms = useMemo(() => {
    const roomsList = Object.values(rooms);
    const main = roomsList.filter((x) => x.id === "0");
    let other = roomsList.filter((x) => x.id !== "0");
    other = other.sort(
      (a, b) => +a.id.split(":").pop()! - +b.id.split(":").pop()!
    );
    return [...(main ? main : []), ...other];
  }, [rooms]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
      </View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {processedRooms.map((room) => (
          <ChatListItem
            key={room.id}
            onClick={() =>
              dispatch({ type: "set current room", payload: room.id })
            }
            active={currentRoom === room.id}
            room={room}
          />
        ))}
      </ScrollView>
      <Footer user={user} onLogOut={onLogOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 8,
  },
});

export default ChatList;

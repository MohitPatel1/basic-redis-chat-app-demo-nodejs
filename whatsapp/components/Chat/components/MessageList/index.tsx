import { MESSAGES_TO_LOAD } from "@/api/getMessages";
import { Message, Room, UserEntry } from "@/app/app-context";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import InfoMessage from "./components/InfoMessage";
import MessagesLoading from "./components/MessagesLoading";
import NoMessages from "./components/NoMessages";
import ReceiverMessage from "./components/ReceiverMessage";
import SenderMessage from "./components/SenderMessage";

interface MessageListProps {
  messageListElement: React.RefObject<ScrollView>;
  messages: Message[] | undefined;
  room: Room | undefined;
  onLoadMoreMessages: () => void;
  user: UserEntry;
  onUserClicked: (userId: string) => void;
  users: Record<string, UserEntry>;
}

const MessageList = ({
  messageListElement,
  messages,
  room,
  onLoadMoreMessages,
  user,
  onUserClicked,
  users,
}: MessageListProps) => (
  <View style={styles.container}>
    {messages === undefined ? (
      <MessagesLoading />
    ) : messages.length === 0 ? (
      <NoMessages />
    ) : (
      <ScrollView
        ref={messageListElement}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {messages && messages.length !== 0 && (
          <>
            {room?.offset && room.offset >= MESSAGES_TO_LOAD && (
              <View style={styles.loadMoreContainer}>
                <View style={styles.divider} />
                <TouchableOpacity
                  onPress={onLoadMoreMessages}
                  style={styles.loadMoreButton}
                >
                  <Text style={styles.loadMoreText}>Load more</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
              </View>
            )}
            
            {messages.map((message, x) => {
              const key = message.message + message.date + message.from + x;
              if (message.from === "info") {
                return <InfoMessage key={key} message={message.message} />;
              }
              if (+message.from !== +user.id) {
                return (
                  <SenderMessage
                    onUserClicked={() => onUserClicked(message.from)}
                    key={key}
                    message={message.message}
                    date={message.date}
                    user={users[message.from]}
                  />
                );
              }
              return (
                <ReceiverMessage
                  username={users[message.from]?.username || ""}
                  key={key}
                  message={message.message}
                  date={message.date}
                />
              );
            })}
          </>
        )}
      </ScrollView>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  loadMoreButton: {
    marginHorizontal: 12,
    backgroundColor: '#6c757d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default MessageList;

import { AppContext, UserEntry } from "@/app/app-context";
import useChatHandlers from "@/hooks/useChatHandlers";
import { MaterialIcons } from '@expo/vector-icons';
import React, { useContext, useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import ChatList from "./components/ChatList";
import MessageList from "./components/MessageList";
import TypingArea from "./components/TypingArea";

interface ChatProps {
  onLogOut: () => void;
  user: UserEntry;
  onMessageSend: (message: string, roomId: string) => void;
}

const DRAWER_WIDTH = Dimensions.get('window').width * 0.8;

const Chat: React.FC<ChatProps> = ({ onLogOut, user, onMessageSend }) => {
  const context = useContext(AppContext);
  const drawerAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const isDrawerOpen = useRef(false);

  const toggleDrawer = () => {
    console.log('Menu button pressed');
    console.log('Current drawer state:', isDrawerOpen.current);
    
    const toValue = isDrawerOpen.current ? -DRAWER_WIDTH : 0;
    const backdropToValue = isDrawerOpen.current ? 0 : 0.5;

    Animated.parallel([
      Animated.timing(drawerAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: backdropToValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      console.log('Animation completed');
      console.log('Drawer is now:', isDrawerOpen.current ? 'open' : 'closed');
    });

    isDrawerOpen.current = !isDrawerOpen.current;
  };

  if (!context) {
    return (
      <View style={styles.container}>
        <Text>Error: Chat must be wrapped in AppContextProvider</Text>
      </View>
    );
  }

  try {
    const {
      onLoadMoreMessages,
      onUserClicked,
      message,
      setMessage,
      rooms,
      room,
      currentRoom,
      dispatch,
      messageListElement,
      roomId,
      messages,
      users,
    } = useChatHandlers(user);

    // Close drawer when room changes
    useEffect(() => {
      if (isDrawerOpen.current) {
        toggleDrawer();
      }
    }, [currentRoom]); // eslint-disable-line react-hooks/exhaustive-deps

    // Inside the Chat component, add this effect
    useEffect(() => {
      return () => {
        drawerAnim.removeAllListeners();
        backdropAnim.removeAllListeners();
      };
    }, []);

    if (!rooms || !dispatch) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View 
          style={[
            styles.backdrop,
            {
              opacity: backdropAnim,
              pointerEvents: isDrawerOpen.current ? 'auto' : 'none',
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={toggleDrawer}>
            <View style={styles.backdropTouchable} />
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Drawer */}
        <Animated.View 
          style={[
            styles.drawer,
            {
              transform: [{ translateX: drawerAnim }],
              width: DRAWER_WIDTH,
            },
          ]}
        >
          <ChatList
            user={user}
            onLogOut={onLogOut}
            rooms={rooms}
            currentRoom={currentRoom}
            dispatch={dispatch}
          />
        </Animated.View>

        {/* Main Chat Area */}
        <View style={styles.chatBody}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={toggleDrawer}
              style={styles.menuButton}
              activeOpacity={0.7}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <MaterialIcons name="menu" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.roomName}>{room ? room.name : "Room"}</Text>
          </View>

          <MessageList
            messageListElement={messageListElement}
            messages={messages}
            room={room}
            onLoadMoreMessages={onLoadMoreMessages}
            user={user}
            onUserClicked={onUserClicked}
            users={users}
          />

          <TypingArea
            message={message}
            setMessage={setMessage}
            onSubmit={() => {
              console.log('onSubmit', message);
              if (message.trim()) {
                onMessageSend(message.trim(), roomId);
                setMessage("");
                if (messageListElement.current) {
                  messageListElement.current.scrollToEnd();
                }
              }
            }}
          />
        </View>
      </View>
    );
  } catch (err) {
    const error = err as Error;
    console.error('Error in Chat component:', error);
    return (
      <View style={styles.container}>
        <Text>Error loading chat: {error.message || 'Unknown error'}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    zIndex: 999,
    elevation: 24,
  },
  backdropTouchable: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
    elevation: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  chatBody: {
    flex: 1,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  menuButton: {
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  roomName: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Chat;

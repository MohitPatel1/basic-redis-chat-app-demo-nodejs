import { getOnlineUsers } from '@/api/getOnlineUsers';
import { getRooms } from '@/api/getRooms';
import { AppContext, AppContextProvider, Room, UserEntry } from '@/app/app-context';
import Chat from '@/components/Chat/Chat';
import { Login } from '@/components/Login';
import Colors from '@/constants/Colors';
import { useSocket } from '@/hooks/useSocket';
import { useUser } from '@/hooks/useUser';
import { parseRoomName } from '@/utils/parseRoomName';
import moment from 'moment';
import { useCallback, useContext, useEffect } from 'react';
import { StyleSheet, Text, View } from "react-native";

// Wrap the entire app with error boundary
const Index = () => {
  try {
    return (
      <AppContextProvider>
        <View style={styles.root}>
          <IndexContent />
        </View>
      </AppContextProvider>
    );
  } catch (err) {
    console.error('Error in Index:', err);
    return (
      <View style={styles.root}>
        <Text>Error loading app</Text>
      </View>
    );
  }
};

const IndexContent = () => {
  try {
    const {
      loading,
      user,
      state,
      dispatch,
      onLogIn,
      onMessageSend,
      onLogOut,
    } = useIndexHandlers();

    if (loading) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {user ? (
          <Chat user={user} onLogOut={onLogOut} onMessageSend={onMessageSend} />
        ) : (
          <View style={styles.loginContainer}>
            <Login onLogIn={onLogIn} />
          </View>
        )}
      </View>
    );
  } catch (err) {
    console.error('Error in IndexContent:', err);
    return (
      <View style={styles.container}>
        <Text>Error loading content</Text>
      </View>
    );
  }
};

const useIndexHandlers = () => {
  const [state, dispatch] = useContext(AppContext);
  const onUserLoaded = useCallback(
    (user: UserEntry | null) => {
      if (user !== null) {
        if (!state.users[user.id]) {
          dispatch({ type: "set user", payload: { ...user, online: true } });
        }
      }
    },
    [dispatch, state.users]
  );

  const { user, onLogIn, onLogOut, loading } = useUser(onUserLoaded, dispatch);
  const socket = useSocket(user, dispatch);

  /** Socket joins specific rooms once they are added */
  useEffect(() => {
    if (user === null) {
      /** We are logged out */
      /** But it's necessary to pre-populate the main room, so the user won't wait for messages once he's logged in */
      return;
    }
    if (socket) {
      /**
       * The socket needs to be joined to the newly added rooms
       * on an active connection.
       */
      const newRooms: Room[] = [];
      Object.keys(state.rooms).forEach((roomId) => {
        const room = state.rooms[roomId];
        if (room.connected) {
          return;
        }
        newRooms.push({ ...room, connected: true });
        socket.emit("room.join", room.id);
      });
      if (newRooms.length !== 0) {
        dispatch({ type: "set rooms", payload: newRooms });
      }
    } else {
      /**
       * It's necessary to set disconnected flags on rooms
       * once the client is not connected
       */
      const newRooms: Room[] = [];
      Object.keys(state.rooms).forEach((roomId) => {
        const room = state.rooms[roomId];
        if (!room.connected) {
          return;
        }
        newRooms.push({ ...room, connected: false });
      });
      /** Only update the state if it's only necessary */
      if (newRooms.length !== 0) {
        dispatch({ type: "set rooms", payload: newRooms });
      }
    }
  }, [user, dispatch, socket, state.rooms, state.users]);

  /** Populate default rooms when user is not null */
  useEffect(() => {
    if (Object.values(state.rooms).length === 0 && user !== null) {
      /** First of all fetch online users. */
      getOnlineUsers().then((users) => {
        dispatch({
          type: "append users",
          payload: users,
        });
      });
      /** Then get rooms. */
      getRooms(user.id).then((rooms) => {
        const payload: Room[] = [];
        rooms.forEach(({ id, names }: { id: string, names: string[] }) => {
          payload.push({ id, name: parseRoomName(names, user.username) });
        });
        /** Here we also can populate the state with default chat rooms */
        dispatch({
          type: "set rooms",
          payload,
        });
        dispatch({ type: "set current room", payload: "0" });
      });
    }
  }, [dispatch, state.rooms, user]);

  const onMessageSend = useCallback(
    (message: string, roomId: string) => {
      if (typeof message !== "string" || message.trim().length === 0) {
        return;
      }
      if (!socket || !user) {
        /** Normally there shouldn't be such case. */
        console.error("Couldn't send message");
        return;
      }
      socket.emit("message", {
        roomId: roomId,
        message,
        from: user.id,
        date: moment(new Date()).unix(),
      });
    },
    [user, socket]
  );

  return {
    loading,
    user,
    state,
    dispatch,
    onLogIn,
    onMessageSend,
    onLogOut,
  };
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  loginContainer: {
    flex: 1,
    width: '100%',
  },
  welcome: {
    width: '100%',
    height: 300,
    borderRadius: 60,
    marginBottom: 80,
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 80,
    color: Colors.gray,
  },
  link: {
    color: Colors.primary,
  },
  button: {
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 22,
    fontWeight: '500',
  },
});

export default Index;

import { createContext, Dispatch, ReactNode, Reducer, useReducer } from "react";

export type Message = {
  from: string;
  date: number;
  message: string;
  roomId?: string;
}

export type Room = {
  connected?: boolean;
  id: string;
  forUserId?: number | string | null;
  lastMessage?: Message | null;
  messages?: Message[];
  name: string;
  offset?: number;
}

export type UserEntry = {
  id: string;
  username: string;
  online?: boolean;
  room?: string;
}

export type Action = {
  type: "clear";
  payload?: {
    id: string;
    lastMessage?: Message;
    message?: Message;
    messages?: Message[];
  };
} | {
  type: "add room";
  payload: Room;
} | {
  type: "append message";
  payload: {
    id: string;
    message: Message;
  }
} | {
  type: "set last message";
  payload: {
    id: string;
    lastMessage: Message | null;
  }
} | {
  type: "append users";
  payload: Record<string, UserEntry>
} | {
  type: "set user";
  payload: UserEntry
} | {
  type: "prepend messages" | "set messages";
  payload: {
    id: string;
    messages: Message[];
  }
} | {
  type: "set current room" | "make user online";
  payload: string;
} | {
  type: "set rooms";
  payload: Room[];
};

export type AppState = {
  currentRoom: string;
  rooms: Record<string, Room>;
  users: Record<string, UserEntry>;
}


const reducer: Reducer<AppState, Action> = (oldState, action) => {
  switch (action.type) {
    case "clear":
      return { currentRoom: "0", rooms: {}, users: {} };
    case "set user": {
      return {
        ...oldState,
        users: { ...oldState.users, [action.payload.id]: action.payload },
      };
    }
    case "make user online": {
      return {
        ...oldState,
        users: {
          ...oldState.users,
          [action.payload]: { ...oldState.users[action.payload], online: true },
        },
      };
    }
    case "append users": {
      return { ...oldState, users: { ...oldState.users, ...action.payload } };
    }
    case "set messages": {
      return {
        ...oldState,
        rooms: {
          ...oldState.rooms,
          [action.payload.id]: {
            ...oldState.rooms[action.payload.id],
            messages: action.payload.messages,
            offset: action.payload.messages.length,
          },
        },
      };
    }
    case "prepend messages": {
      const messages = [
        ...action.payload.messages,
        ...(oldState.rooms[action.payload.id].messages ?? []),
      ];
      return {
        ...oldState,
        rooms: {
          ...oldState.rooms,
          [action.payload.id]: {
            ...oldState.rooms[action.payload.id],
            messages,
            offset: messages.length,
          },
        },
      };
    }
    case "append message":
      if (oldState.rooms[action.payload.id] === undefined) {
        return oldState;
      }
      return {
        ...oldState,
        rooms: {
          ...oldState.rooms,
          [action.payload.id]: {
            ...oldState.rooms[action.payload.id],
            lastMessage: action.payload.message,
            messages: oldState.rooms[action.payload.id].messages
              ? [
                ...(oldState.rooms[action.payload.id].messages ?? []),
                action.payload.message,
              ]
              : undefined,
          },
        },
      };
    case 'set last message':
      return { ...oldState, rooms: { ...oldState.rooms, [action.payload.id]: { ...oldState.rooms[action.payload.id], lastMessage: action.payload.lastMessage } } };
    case "set current room":
      return { ...oldState, currentRoom: action.payload };
    case "add room":
      return {
        ...oldState,
        rooms: { ...oldState.rooms, [action.payload.id]: action.payload },
      };
    case "set rooms": {
      const newRooms = action.payload;
      const rooms = { ...oldState.rooms };
      newRooms.forEach((room) => {
        rooms[room.id] = {
          ...room,
          messages: rooms[room.id] && rooms[room.id].messages,
        };
      });
      return { ...oldState, rooms };
    }
    default:
      return oldState;
  }
};

const initialState: AppState = {
  currentRoom: "main",
  rooms: {},
  users: {},
};

export const AppContext = createContext<[AppState, Dispatch<Action>]>([initialState, () => initialState]);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={[state, dispatch]}>{children}</AppContext.Provider>
};

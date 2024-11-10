
import { getUsers } from "@/api/getUsers";
import { Action, Message, UserEntry } from "@/app/app-context";
import { Dispatch } from "react";

export const populateUsersFromLoadedMessages = async (users: Record<string, UserEntry>, dispatch: Dispatch<Action>, messages: Message[]) => {
  const userIds = new Set(messages.map((message) => message.from));

  const ids = [...userIds].filter(
    (id) => users[id] === undefined
  );

  if (ids.length !== 0) {
    /** We need to fetch users first */
    const newUsers = await getUsers(ids);
    dispatch({
      type: "append users",
      payload: newUsers,
    });
  }

};
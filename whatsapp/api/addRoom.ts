import api from "@/config/axios";

/** This one is called on a private messages room created. */
export const addRoom = async (user1Id: string, user2Id: string) => {
  return api.post('/room', { user1Id, user2Id }).then(x => x.data);
};

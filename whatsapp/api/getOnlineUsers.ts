import api from "@/config/axios";

/** Fetch users which are online */
export const getOnlineUsers = () => {
  return api.get('/users/online').then(x => x.data);
};
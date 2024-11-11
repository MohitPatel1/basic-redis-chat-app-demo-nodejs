import api from "@/config/axios";

export const getRooms = async (userId: string) => {
  return api.get(`/rooms/${userId}`).then(x => x.data);
};
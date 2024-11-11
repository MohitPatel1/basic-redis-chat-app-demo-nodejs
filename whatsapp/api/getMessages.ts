import api from "@/config/axios";

export const MESSAGES_TO_LOAD = 15;

export const getMessages = (id: string, offset = 0, size = MESSAGES_TO_LOAD) => {
  return api.get(`/room/${id}/messages`, {
    params: { offset, size }
  }).then(x => x.data.reverse());
};
import { apiUrl } from "@/utils/getApiUrl";
import axios from "axios";

export const MESSAGES_TO_LOAD = 15;

export const getMessages = (id: string,
  offset = 0,
  size = MESSAGES_TO_LOAD
) => {
  return axios.get(apiUrl(`/room/${id}/messages`), {
    params: {
      offset,
      size
    }
  })
    .then(x => x.data.reverse());
};
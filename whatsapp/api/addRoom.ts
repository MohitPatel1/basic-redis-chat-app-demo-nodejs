import { apiUrl } from "@/utils/getApiUrl";
import axios from "axios";

/** This one is called on a private messages room created. */
export const addRoom = async (user1Id: string, user2Id: string) => {
  return axios.post(apiUrl(`/room`), { user1Id, user2Id }).then(x => x.data);
};

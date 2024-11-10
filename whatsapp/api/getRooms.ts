import { apiUrl } from "@/utils/getApiUrl";
import axios from "axios";

export const getRooms = async (userId: string) => {
  return axios.get(apiUrl(`/rooms/${userId}`)).then(x => x.data);
};
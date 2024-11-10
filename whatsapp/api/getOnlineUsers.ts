import { apiUrl } from "@/utils/getApiUrl";
import axios from "axios";


/** Fetch users which are online */
export const getOnlineUsers = () => {
  return axios.get(apiUrl(`/users/online`)).then(x => x.data);
};
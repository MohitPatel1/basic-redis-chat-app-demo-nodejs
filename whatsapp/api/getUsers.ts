import { apiUrl } from "@/utils/getApiUrl";
import axios from "axios";

export const getUsers = (ids: string[]) => {
  return axios.get(apiUrl(`/users`), { params: { ids } }).then(x => x.data);
};

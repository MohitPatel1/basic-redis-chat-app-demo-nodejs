import { apiUrl } from "@/utils/getApiUrl";
import axios from "axios";

/** Handle user log in */
export const login = (username: string, password: string) => {
  return axios.post(apiUrl('/login'), {
    username,
    password
  }).then(x =>
    x.data
  )
    .catch(e => { throw new Error(e.response && e.response.data && e.response.data.message); });
};
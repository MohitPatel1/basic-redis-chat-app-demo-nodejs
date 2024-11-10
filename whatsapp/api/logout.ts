import { apiUrl } from "@/utils/getApiUrl";
import axios from "axios";

export const logOut = () => {
  return axios.post(apiUrl('/logout'));
};

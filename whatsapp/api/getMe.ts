import { apiUrl } from "@/utils/getApiUrl";
import axios from "axios";

/** Checks if there's an existing session. */
export const getMe = () => {
  return axios.get(apiUrl('/me'))
    .then(x => x.data)
    .catch(_ => null);
};
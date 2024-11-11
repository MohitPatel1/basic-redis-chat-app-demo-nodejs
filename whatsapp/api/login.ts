import api from "@/config/axios";

/** Handle user log in */
export const login = (username: string, password: string) => {
  return api.post('/login', { username, password })
    .then(x => x.data)
    .catch(e => { throw new Error(e.response?.data?.message); });
};
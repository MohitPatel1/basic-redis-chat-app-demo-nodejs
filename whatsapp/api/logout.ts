import api from "@/config/axios";

export const logOut = () => {
  return api.post('/logout');
};

import api from "@/config/axios";

export const getUsers = (ids: string[]) => {
  return api.get('/users', { params: { ids } }).then(x => x.data);
};

import api from "@/config/axios";

/** Checks if there's an existing session. */
export const getMe = () => {
  return api.get('/me')
    .then(x => x.data)
    .catch(_ => null);
};
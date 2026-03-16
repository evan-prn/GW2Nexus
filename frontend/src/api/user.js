import http from "./httpClient";

export const usersApi = {
  all: () => http.get("/users"),
  find: (id) => http.get(`/users/${id}`),
};

import api from "@/lib/axios";

// DummyJSON's demo login. expiresInMins keeps the token alive for the
// length of a normal working session.
export function login(username, password) {
  return api.post("/auth/login", {
    username,
    password,
    expiresInMins: 30,
  });
}

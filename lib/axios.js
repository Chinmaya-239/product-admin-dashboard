import axios from "axios";

// One shared Axios instance for the whole app.
// - baseURL points at DummyJSON.
// - the request interceptor attaches the saved login token to every call.
// - the response interceptor handles errors in one place: if the token is
//   rejected (401), we clear it and send the user back to the login page.
const api = axios.create({
  baseURL: "https://dummyjson.com",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; max-age=0";
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

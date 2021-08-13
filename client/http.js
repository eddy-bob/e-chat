import axios from "axios";
const url =
  process.env.MY_ENV === "development"
    ? "http://127.0.0.1:5000/api/v1/"
    : "https://e-chat/api/v1/";

const http = axios.create({
  baseURL: url,

  headers: { "X-Requested-With": "XMLHttpRequest" },
});
http.interceptors.request.use((config) => {
  console.log("request has been sent");
  return config;
});

http.interceptors.response.use((response) => {
  console.log("request has been sent");
  return response;
});
export default http;

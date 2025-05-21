import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL.split(",")[0]
    : "http://localhost:5000",
});

export default instance;

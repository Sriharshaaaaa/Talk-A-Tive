import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL || "https://talk-a-tive-backend.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;

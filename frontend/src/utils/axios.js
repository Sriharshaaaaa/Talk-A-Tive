import axios from "axios";

const instance = axios.create({
  baseURL: "https://talk-a-tive-backend.onrender.com",
});

export default instance;

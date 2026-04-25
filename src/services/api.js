import axios from "axios";

const API = axios.create({
  baseURL: "https://backend-lab-ecosistemas-w4.vercel.app/api"
});

export default API;
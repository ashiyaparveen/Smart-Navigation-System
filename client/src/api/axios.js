import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-navigation-system.onrender.com/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export const getLocations = () => API.get("/locations");

export default API;

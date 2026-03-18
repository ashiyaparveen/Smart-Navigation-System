import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-navigation-system.onrender.com/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export const getLocations = () => API.get("/locations");
export const createLocation = (data) => API.post("/locations", data);
export const updateLocation = (id, data) => API.put(`/locations/${id}`, data);
export const deleteLocation = (id) => API.delete(`/locations/${id}`);

export default API;

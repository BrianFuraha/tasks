import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

export const userChats = (id) => API.get(`/api/chat/${id}`);
export const getUser = (userId) => API.get(`/api/user/${userId}`);
export const getMessages = (id) => API.get(`/api/message/${id}`);
export const addMessage = (data) => API.post("/api/message/newMassage", data);
export const getRunners = () => API.get("/api/user/");
export const comment = (data, id) => API.put(`/api/user/${id}/comment`, data);
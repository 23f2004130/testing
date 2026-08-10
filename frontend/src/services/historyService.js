import api from "../services/api";
export const getHistory = () => {
  return api.get("/palm/history");
};
export const getHistoryById = (id) => {
  return api.get(`/palm/history/${id}`);
};
import api from "../services/api";
export const getProfile = () => {
    return api.get("/profile");
};

export const createProfile = (data) => {
    return api.post("/profile", data);
};

export const updateProfile = (data) => {
    return api.put("/profile", data);
};
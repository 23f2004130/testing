import api from "./api";
export const registerUser = (data) => {
    return api.post("/auth/register", data);
};

export const loginUser = (data) => {
    const formData = new URLSearchParams();
    formData.append("username", data.email);
    formData.append("password", data.password);

    return api.post("/auth/login", formData, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
};

export const getCurrentUser = () => {
    return api.get("/auth/me");
};

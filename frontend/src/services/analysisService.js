import api from "./api";

export const uploadPalmImage = (formData, onUploadProgress) => {
  return api.post("/palm/upload", formData, {
    onUploadProgress,
  });
};

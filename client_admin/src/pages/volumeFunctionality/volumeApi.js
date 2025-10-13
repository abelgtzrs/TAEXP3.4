import api from "../../services/api";

export const fetchVolumes = async () => {
  const response = await api.get("/admin/volumes");
  return response.data.data;
};

export const createVolume = async (payload) => {
  await api.post("/admin/volumes", payload);
};

export const updateVolume = async (id, payload) => {
  await api.put(`/admin/volumes/${id}`, payload);
};

export const deleteVolume = async (id) => {
  await api.delete(`/admin/volumes/${id}`);
};

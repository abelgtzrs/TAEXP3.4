import api from "./api";

const base = "/admin/snoopys";

export const listSnoopys = async () => {
  const res = await api.get(base);
  return res.data.data;
};

export const createSnoopy = async (payload) => {
  const res = await api.post(base, payload);
  return res.data.data;
};

export const updateSnoopy = async (id, payload) => {
  const res = await api.put(`${base}/${id}`, payload);
  return res.data.data;
};

export const deleteSnoopy = async (id) => {
  const res = await api.delete(`${base}/${id}`);
  return res.data;
};

export default { listSnoopys, createSnoopy, updateSnoopy, deleteSnoopy };

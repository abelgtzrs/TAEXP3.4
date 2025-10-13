import api from "./api";

export async function listPersonas() {
  const res = await api.get("/admin/personas");
  return res.data.data;
}

export async function updatePersona(id, payload) {
  const res = await api.put(`/admin/personas/${id}`, payload);
  return res.data.data;
}

import api from './api';

export const listBlessingDefs = async () => {
  const { data } = await api.get('/admin/blessings');
  return data.items || [];
};

export const createBlessingDef = async (payload) => {
  const { data } = await api.post('/admin/blessings', payload);
  return data.item;
};

export const updateBlessingDef = async (id, payload) => {
  const { data } = await api.put(`/admin/blessings/${id}`, payload);
  return data.item;
};

export const deleteBlessingDef = async (id) => {
  await api.delete(`/admin/blessings/${id}`);
};

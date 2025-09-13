import api from './api';

export const adminUserService = {
  list: async () => {
    const res = await api.get('/admin/users');
    return res.data.data;
  },
  update: async (id, payload) => {
    const res = await api.put(`/admin/users/${id}`, payload);
    return res.data.data;
  },
  resetPassword: async (id, newPassword) => {
    const res = await api.put(`/admin/users/${id}/reset-password`, { newPassword });
    return res.data;
  }
};

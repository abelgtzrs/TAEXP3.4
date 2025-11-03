// src/services/layoutService.js
import api from "./api";

export const layoutService = {
  async getLayout() {
    const res = await api.get("/users/me/dashboard-layout");
    return res.data?.data ?? null;
  },
  async saveLayout(layout) {
    await api.put("/users/me/dashboard-layout", layout);
    return true;
  },
};

export default layoutService;

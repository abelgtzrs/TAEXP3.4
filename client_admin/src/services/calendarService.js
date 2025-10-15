import api from "./api";

export const calendarService = {
  // Events
  listEvents: () => api.get("/calendar/events").then((r) => r.data.items),
  createEvent: (payload) => api.post("/calendar/events", payload).then((r) => r.data.item),
  updateEvent: (id, payload) => api.put(`/calendar/events/${id}`, payload).then((r) => r.data.item),
  deleteEvent: (id) => api.delete(`/calendar/events/${id}`).then((r) => r.data),

  // Bills
  listBills: () => api.get("/calendar/bills").then((r) => r.data.items),
  createBill: (payload) => api.post("/calendar/bills", payload).then((r) => r.data.item),
  updateBill: (id, payload) => api.put(`/calendar/bills/${id}`, payload).then((r) => r.data.item),
  deleteBill: (id) => api.delete(`/calendar/bills/${id}`).then((r) => r.data),

  // Combined monthly schedule
  getMonthlySchedule: ({ year, month }) =>
    api.get(`/calendar/monthly-schedule`, { params: { year, month } }).then((r) => r.data.items),

  // Yearly events
  listYearly: () => api.get("/calendar/yearly").then((r) => r.data.items),
  createYearly: (payload) => api.post("/calendar/yearly", payload).then((r) => r.data.item),
  updateYearly: (id, payload) => api.put(`/calendar/yearly/${id}`, payload).then((r) => r.data.item),
  deleteYearly: (id) => api.delete(`/calendar/yearly/${id}`).then((r) => r.data),
};

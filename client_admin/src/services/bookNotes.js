// src/services/bookNotes.js
import api from "./api";

export const listBookNotes = (bookId) => api.get(`/books/${bookId}/notes`);
export const createBookNote = (bookId, payload) => api.post(`/books/${bookId}/notes`, payload);
export const updateBookNote = (bookId, noteId, payload) => api.put(`/books/${bookId}/notes/${noteId}`, payload);
export const deleteBookNote = (bookId, noteId) => api.delete(`/books/${bookId}/notes/${noteId}`);
export const uploadBookPdf = (bookId, file) => {
  const form = new FormData();
  form.append("pdf", file);
  return api.post(`/books/${bookId}/pdf`, form, { headers: { "Content-Type": "multipart/form-data" } });
};

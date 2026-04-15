import client from './client';

export const getLeads = (params) =>
  client.get('/leads', { params }).then((r) => r.data);

export const getLead = (id) =>
  client.get(`/leads/${id}`).then((r) => r.data);

export const updateLead = (id, data) =>
  client.put(`/leads/${id}`, data).then((r) => r.data);

export const updateLeadStage = (id, stage) =>
  client.patch(`/leads/${id}/stage`, { stage }).then((r) => r.data);

export const deleteLead = (id) =>
  client.delete(`/leads/${id}`).then((r) => r.data);

export const getNotes = (leadId) =>
  client.get(`/leads/${leadId}/notes`).then((r) => r.data);

export const addNote = (leadId, content) =>
  client.post(`/leads/${leadId}/notes`, { content }).then((r) => r.data);

export const deleteNote = (id) =>
  client.delete(`/notes/${id}`).then((r) => r.data);

export const getTasks = (params) =>
  client.get('/tasks', { params }).then((r) => r.data);

export const createTask = (data) =>
  client.post('/tasks', data).then((r) => r.data);

export const updateTask = (id, data) =>
  client.patch(`/tasks/${id}`, data).then((r) => r.data);

export const deleteTask = (id) =>
  client.delete(`/tasks/${id}`).then((r) => r.data);

export const getAnalyticsSummary = () =>
  client.get('/leads/analytics/summary').then((r) => r.data);

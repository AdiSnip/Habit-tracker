// API service for task operations
import axios from 'axios';

export const getTasks = async () => {
  const res = await axios.get('/api/readtask');
  return res.data.tasks;
};

export const createTask = async (task) => {
  const res = await axios.post('/api/createtask', task);
  return res.data.task;
};

export const updateTaskById = async (id, updates) => {
  const res = await axios.patch(`/api/updatetask/${id}`, updates);
  return res.data.task;
};

export const deleteTaskById = async (id) => {
  await axios.delete(`/api/deletetask/${id}`);
};

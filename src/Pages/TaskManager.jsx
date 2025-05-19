import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import TaskForm from '../Components/TaskForm.jsx';
import TaskItem from '../Components/TaskItem.jsx';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const titleRef = useRef();
  const dueDateRef = useRef();
  const descRef = useRef();
  const priorityRef = useRef();

  useEffect(() => {
    axios.get('/api/readtask')
      .then(res => setTasks(res.data.tasks))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    const newTask = {
      title: titleRef.current.value,
      dueDate: dueDateRef.current.value,
      description: descRef.current.value,
      priority: priorityRef.current.value || 'Low',
    };

    if (!newTask.title.trim()) return;

    try {
      const res = await axios.post('/api/createtask', newTask);
      if (res.data.success) {
        setTasks([...tasks, res.data.task]);
        e.target.reset();
        setShowForm(false);
      }
    } catch (err) {
      console.error('Add error:', err);
    }
  };

  const handleToggleTask = async (id) => {
    const task = tasks.find(t => t._id === id);
    const updated = { ...task, isCompleted: !task.isCompleted };
    setTasks(tasks.map(t => t._id === id ? updated : t));
    await axios.patch(`/api/updatetask/${id}`, { isCompleted: updated.isCompleted });
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`/api/deletetask/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    const updatedTask = {
      title: titleRef.current.value,
      dueDate: dueDateRef.current.value,
      description: descRef.current.value,
      priority: priorityRef.current.value,
    };

    try {
      const res = await axios.patch(`/api/updatetask/${editingTask._id}`, updatedTask);
      if (res.data.success) {
        setTasks(tasks.map(t => t._id === editingTask._id ? res.data.task : t));
        setEditingTask(null);
      }
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setShowForm(false);
    setTimeout(() => {
      titleRef.current.value = task.title;
      dueDateRef.current.value = task.dueDate || '';
      descRef.current.value = task.description;
      priorityRef.current.value = task.priority;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-indigo-700">🎮 Task Arena</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingTask(null);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              {showForm ? '❌ Cancel' : '➕ New Quest'}
            </button>
          </div>

          {(showForm || editingTask) && (
            <TaskForm
              onSubmit={editingTask ? handleUpdateTask : handleAddTask}
              refs={{ titleRef, dueDateRef, descRef, priorityRef }}
              isEdit={!!editingTask}
            />
          )}

          <div className="mt-6 space-y-4">
            {tasks.map(task => (
              <TaskItem
                key={task._id}
                task={task}
                onToggle={() => handleToggleTask(task._id)}
                onDelete={() => handleDeleteTask(task._id)}
                onEdit={() => startEditing(task)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;

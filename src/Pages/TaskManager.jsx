import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskForm from '../Components/TaskForm.jsx';
import TaskItem from '../Components/TaskItem.jsx';

const TaskManager = ({ getData, refetch }) => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [user, setUser] = useState();

  const titleRef = useRef();
  const dueDateRef = useRef();
  const descRef = useRef();
  const priorityRef = useRef();

  useEffect(() => {
    axios.get('/api/readtask')
      .then(res => setTasks(res.data.tasks))
      .catch(err => console.error('Fetch error:', err));

    if (Array.isArray(getData) && getData.length > 0) {
      setUser(getData[0]);
    } else if (getData) {
      setUser(getData);
    } else {
      setUser(null);
    }
  }, [getData]);

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
        setTasks(prevTasks => [res.data.task, ...prevTasks]);
        e.target.reset();
        setShowForm(false);
      }
    } catch (err) {
      console.error('Add error:', err);
    }
  };

  const handleToggleTask = async (id) => {
    const task = tasks.find(t => t._id === id);
    if (!task) return;

    const willBeCompleted = !task.isCompleted;
    const updatedTask = { ...task, isCompleted: willBeCompleted };

    setTasks(prev => prev.map(t => t._id === id ? updatedTask : t));

    try {
      await axios.patch(`/api/updatetask/${id}`, { isCompleted: willBeCompleted }, { withCredentials: true });

      if (willBeCompleted) {
        const xpGain = 30;
        const actualUser = Array.isArray(user) ? user[0] : user;

        if (!actualUser) return;

        let { xp, limitxp, level } = actualUser;
        let newXP = Number(xp) + xpGain;

        if (newXP >= limitxp) {
          newXP -= limitxp;
          level += 1;
          limitxp += 50;
        }
        refetch();
        const res = await axios.patch('/api/updateuser/xp', { xp: newXP, limitxp, level }, { withCredentials: true });
        if (res.data.success) setUser([res.data.user]);
      }
    } catch (error) {
      console.error("Toggle failed:", error);
      setTasks(prev => prev.map(t => t._id === id ? task : t));
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;

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

  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'completed') return task.isCompleted;
      if (filter === 'incomplete') return !task.isCompleted;
      return true;
    })
    .sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

  const totalCompleted = tasks.filter(t => t.isCompleted).length;
  const totalIncomplete = tasks.filter(t => !t.isCompleted).length;

  const isDueSoon = (dueDate) => {
    const today = new Date();
    const taskDate = new Date(dueDate);
    const diff = (taskDate - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-black p-2 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-indigo-950 rounded-xl shadow-2xl p-3 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-6 gap-2">
            <motion.h1
              className="text-2xl sm:text-3xl font-bold text-indigo-400 text-center sm:text-left"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              🎮 Task Arena
            </motion.h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowForm(!showForm);
                setEditingTask(null);
              }}
              className="bg-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base hover:bg-indigo-700 transition w-full sm:w-auto"
            >
              {showForm ? '❌ Cancel' : '+ New Quest'}
            </motion.button>
          </div>

          <AnimatePresence>
            {(showForm || editingTask) && (
              <motion.div
                key="task-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <TaskForm
                  onSubmit={editingTask ? handleUpdateTask : handleAddTask}
                  refs={{ titleRef, dueDateRef, descRef, priorityRef }}
                  isEdit={!!editingTask}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="sticky top-0 z-10 bg-indigo-950 py-2 sm:py-3 mb-3 sm:mb-4 border-b border-gray-200 flex gap-2 sm:gap-4 overflow-x-auto">
            {['all', 'completed', 'incomplete'].map(option => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={option}
                onClick={() => setFilter(option)}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded font-medium text-xs sm:text-base ${
                  filter === option ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700'
                } hover:bg-indigo-400 hover:text-white transition whitespace-nowrap`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </motion.button>
            ))}
          </div>

          <div className="mb-2 sm:mb-4 text-xs sm:text-sm text-gray-300 text-center sm:text-left">
            ✅ Completed: {totalCompleted} | 📌 Incomplete: {totalIncomplete}
          </div>

          <div className="space-y-3 sm:space-y-4">
            <AnimatePresence>
              {filteredTasks.map(task => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className={isDueSoon(task.dueDate) ? 'border-l-4 border-yellow-400 pl-2' : ''}
                >
                  <TaskItem
                    task={task}
                    onToggle={() => handleToggleTask(task._id)}
                    onDelete={() => handleDeleteTask(task._id)}
                    onEdit={() => startEditing(task)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredTasks.length === 0 && (
              <motion.p
                className="text-gray-500 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No tasks found in this section.
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TaskManager;

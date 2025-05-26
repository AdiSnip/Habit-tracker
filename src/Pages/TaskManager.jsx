import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import TaskForm from '../Components/TaskForm.jsx';
import TaskItem from '../Components/TaskItem.jsx';

const TaskManager = ({ getData }) => {
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
      setUser(getData[0]); // force to single user object
    } else if (getData) {
      setUser(getData);
    } else {
      setUser(null); // fallback
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
        // Put new task at the top
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

    // Optimistic UI update
    setTasks(prev =>
      prev.map(t => t._id === id ? updatedTask : t)
    );

    try {
      await axios.patch(`/api/updatetask/${id}`, { isCompleted: willBeCompleted }, { withCredentials: true });

      if (willBeCompleted) {
        const xpGain = 30;

        // Access the actual user data (assuming user is an array with 1 object)
        const actualUser = Array.isArray(user) ? user[0] : user;

        if (!actualUser) {
          console.error("User data not available");
          return;
        }

        const currentXP = Number(actualUser.xp);
        let limitxp = Number(actualUser.limitxp);
        let level = Number(actualUser.level);

        if ([currentXP, limitxp, level].some(val => isNaN(val))) {
          console.error("Invalid user XP data:", actualUser);
          return;
        }

        let newXP = currentXP + xpGain;

        if (newXP >= limitxp) {
          newXP -= limitxp;
          level += 1;
          limitxp += 50;
        }

        // Update user XP using PATCH with credentials
        const res = await axios.patch('/api/updateuser/xp', {
          xp: newXP,
          limitxp,
          level,
        }, { withCredentials: true });

        if (res.data.success) {
          // Optionally update user state if you want to reflect new XP immediately
          setUser([res.data.user]);
        }

        console.log('XP updated:', newXP);
      }
    } catch (error) {
      console.error("Task toggle failed:", error);

      // Rollback UI change on failure
      setTasks(prev =>
        prev.map(t => t._id === id ? task : t)
      );
    }
  };

  const handleDeleteTask = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

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
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
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
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-indigo-950 rounded-xl shadow-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-indigo-500">🎮 Task Arena</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingTask(null);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              {showForm ? '❌ Cancel' : '+ New Quest'}
            </button>
          </div>

          {(showForm || editingTask) && (
            <TaskForm
              onSubmit={editingTask ? handleUpdateTask : handleAddTask}
              refs={{ titleRef, dueDateRef, descRef, priorityRef }}
              isEdit={!!editingTask}
            />
          )}

          {/* Filter Bar */}
          <div className="sticky top-0 z-10 bg-indigo-950 py-3 mb-4 border-b border-gray-200 flex gap-4">
            {['all', 'completed', 'incomplete'].map(option => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 rounded ${
                  filter === option ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700'
                } hover:bg-indigo-400 hover:text-white transition`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>

          {/* Task Stats */}
          <div className="mb-4 text-sm text-gray-600">
            <span>✅ Completed: {totalCompleted} </span> | 
            <span> 📌 Incomplete: {totalIncomplete}</span>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <div key={task._id} className={isDueSoon(task.dueDate) ? 'border-l-4 border-yellow-400 pl-2' : ''}>
                <TaskItem
                  task={task}
                  onToggle={() => handleToggleTask(task._id)}
                  onDelete={() => handleDeleteTask(task._id)}
                  onEdit={() => startEditing(task)}
                />
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <p className="text-gray-500 text-center">No tasks found in this section.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;

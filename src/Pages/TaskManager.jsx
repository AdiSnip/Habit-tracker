import React, { useState } from 'react';

const TaskManager = ({ getData }) => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete project documentation', completed: false, dueDate: '2024-03-20', description: 'Write detailed documentation for the project.' },
    { id: 2, title: 'Review pull requests', completed: false, dueDate: '2024-03-19', description: 'Review the latest pull requests from team members.' },
    { id: 3, title: 'Team meeting', completed: true, dueDate: '2024-03-18', description: 'Discuss project updates and timelines with the team.' },
  ]);
  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: '',
    description: '', // Ensure description is part of newTask state
  });
  const [showAddTask, setShowAddTask] = useState(false);

  const handleAddTask = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        title: newTask.title,
        completed: false,
        dueDate: newTask.dueDate,
        description: newTask.description, // Include description when adding new task
      };

      // Add task to state
      setTasks([...tasks, task]);
      setNewTask({ title: '', dueDate: '', description: '' }); // Clear form
      setShowAddTask(false);

      // Call getData function passed as a prop to refresh the task data (if needed)
      getData();
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="min-h-[92vh] bg-zinc-200 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              {showAddTask ? 'Cancel' : 'Add New Task'}
            </button>
          </div>

          {showAddTask && (
            <form onSubmit={handleAddTask} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    autoComplete="off"
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task details"
                />
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                >
                  Add Task
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {tasks.map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.title}
                    </h3>
                    {task.dueDate && (
                      <span className="text-xs text-gray-500">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {task.description && (
                      <p className="mt-2 text-sm text-gray-600">{task.description}</p> // Display description
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;

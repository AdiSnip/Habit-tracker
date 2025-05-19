import React from 'react';

const TaskForm = ({ onSubmit, refs, isEdit }) => (
  <form
    onSubmit={onSubmit}
    className="grid gap-4 bg-gradient-to-br from-white to-indigo-100 p-6 rounded-xl shadow-lg border border-indigo-200"
  >
    <input
      ref={refs.titleRef}
      type="text"
      placeholder="📝 Quest Title"
      required
      className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
    <input
      ref={refs.dueDateRef}
      type="date"
      className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
    <select
      ref={refs.priorityRef}
      className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      <option value="Low">🟢 Low</option>
      <option value="Medium">🟡 Medium</option>
      <option value="High">🔴 High</option>
    </select>
    <textarea
      ref={refs.descRef}
      placeholder="📖 Description"
      className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
      rows="3"
    />
    <button
      type="submit"
      className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
    >
      {isEdit ? '✅ Update Quest' : '🚀 Add Quest'}
    </button>
  </form>
);

export default TaskForm;

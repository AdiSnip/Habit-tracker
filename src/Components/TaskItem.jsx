import React from 'react';
import { Trash2 } from "lucide-react";


const TaskItem = ({ task, onToggle, onDelete, onEdit }) => (
  <div className="flex justify-between items-start p-4 bg-indigo-50 rounded-lg border border-indigo-300 shadow-sm">
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={onToggle}
        className="mt-6 mr-2 scale-150"
      />
      <div>
        <h3 className={`font-bold text-lg ${task.isCompleted ? 'line-through text-gray-400' : 'text-indigo-900'}`}>
          {task.title} {task.priority === 'High' && '🔥'}
        </h3>
        <p className="text-sm text-gray-600">{task.description}</p>
        <p className="text-xs text-gray-500 mt-1">
          📅 {task.dueDate || 'No deadline'} | 🎯 {task.priority}
        </p>
      </div>
    </div>
    <div className="flex gap-2">
      <button onClick={onEdit} className="text-blue-500 hover:text-blue-700">✏️</button>
<button onClick={onDelete} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition">
  <Trash2 className="w-5 h-5" />
</button>
    </div>
  </div>
);

export default TaskItem;

import React, { useEffect, useState } from "react";
import { Trophy, Users, CheckCircle } from "lucide-react";
import axios from "axios";

/**
 * Main Dashboard Container Component
 * @param {Object} data - Array containing the current user object as the first element.
 */
const Container = ({ data }) => {
  const [tasks, setTasks] = useState([]);
  const user = data?.[0]; // Extracting the user object from props

  // Fetch tasks only when user is available
  useEffect(() => {
    if (user) {
      axios.get("/api/readtask")
        .then((res) => setTasks(res.data.tasks || []))
        .catch((err) => console.error("Failed to fetch tasks:", err));
    }
  }, [user]);

  // Show loading state if user data hasn't arrived yet
  if (!user) return <div className="p-4 text-center text-gray-500">Loading...</div>;

  // Calculate progress percentage for XP bar
  const progressPercent = (user.xp % 1000) / 10;

  // Check if a given date is today
  const isToday = (dateString) => {
    const taskDate = new Date(dateString);
    const today = new Date();
    taskDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  };

  // Filter today's incomplete tasks
  const todaysTasks = tasks.filter(task => isToday(task.dueDate) && !task.isCompleted);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-purple-50 p-6 text-black">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        
        {/* User Welcome Info and XP Progress Bar */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-blue-800">Welcome, {user.firstname} 👋</h1>
          
          <div className="flex items-center gap-3">
            <span className="text-sm bg-blue-200 text-blue-700 font-semibold px-2 py-1 rounded-xl">
              Level {user.level}
            </span>
            <span className="text-sm text-gray-600">{user.xp} XP</span>
          </div>
          
          {/* XP Progress Bar */}
          <div className="mt-2 w-full bg-gray-300 rounded-full h-3 shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Progress to next level</p>
        </div>

        {/* User Avatar & Username */}
        <div className="flex items-center gap-4 mt-6 md:mt-0 bg-white p-2 rounded-full shadow-md">
          <img
            src={user.avatar}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
          />
          <div>
            <p className="font-semibold text-gray-700">{user.username}</p>
          </div>
        </div>
      </div>

      {/* Dashboard Grid: Tasks, Achievements, Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Today's Tasks Card */}
        <Card>
          <SectionHeader icon={<CheckCircle className="text-green-500" />} title="Today's Tasks" />
          <div className="flex flex-col justify-between h-full">
            {todaysTasks.length > 0 ? (
              <ul className="space-y-3 mb-4">
                {todaysTasks.map((task, i) => (
                  <li key={i} className="bg-blue-50 border border-blue-100 p-3 rounded-xl shadow-sm hover:bg-blue-100">
                    <h3 className="font-semibold text-sm text-blue-800">{task.title}</h3>
                    <p className="text-xs text-gray-500">
                      {task.priority} Priority • Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mb-4">No tasks due today 🎉</p>
            )}
            <button className="text-sm text-purple-600 hover:underline text-center">View All Tasks</button>
          </div>
        </Card>

        {/* Achievements Card */}
        <Card>
          <SectionHeader icon={<Trophy className="text-yellow-500" />} title="Achievements" />
          <div className="flex flex-col gap-4 mt-2">
            <StatItem label="Badges Earned" value={user.badges.length} />
            <StatItem label="Streak" value={`${user.streak.current} days`} />
            <StatItem
              label="Daily Challenge"
              value={user.dailyChallengeCompleted ? "Completed" : "Incomplete"}
              color={user.dailyChallengeCompleted ? "text-green-600" : "text-red-500"}
            />
          </div>
        </Card>

        {/* Leaderboard Card (Static Example) */}
        <Card>
          <SectionHeader icon={<Users className="text-blue-600" />} title="Leaderboard" />
          <ul className="space-y-4 mt-2">
            <LeaderboardItem position="🥇" name="Jamie" points="3200 XP" />
            <LeaderboardItem position="🥈" name="Alex" points="2800 XP" />
            <LeaderboardItem position="🥉" name="Taylor" points="2500 XP" />
          </ul>
        </Card>
      </div>

      {/* Motivational Footer */}
      <p className="text-center text-xs text-gray-400 mt-10 italic">
        “Consistency beats intensity.” 🚀
      </p>
    </div>
  );
};

//////////////////////////////////////////////////////////////
// Reusable Components
//////////////////////////////////////////////////////////////

/**
 * Card Component - Common wrapper for each dashboard section
 */
const Card = ({ children }) => (
  <div className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all">{children}</div>
);

/**
 * SectionHeader Component - Header with icon and title
 */
const SectionHeader = ({ icon, title }) => (
  <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800">
    {icon} {title}
  </h2>
);

/**
 * StatItem Component - For showing labeled stats with optional color
 */
const StatItem = ({ label, value, color = "text-black" }) => (
  <div className="flex justify-between items-center bg-purple-50 p-3 rounded-xl shadow-sm">
    <span className="text-sm">{label}</span>
    <span className={`font-semibold ${color}`}>{value}</span>
  </div>
);

/**
 * LeaderboardItem Component - Shows rank, user name, and points
 */
const LeaderboardItem = ({ position, name, points }) => (
  <li className="flex justify-between items-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
    <div className="flex items-center gap-2 font-medium">
      <span className="text-xl">{position}</span>
      <span>{name}</span>
    </div>
    <span className="text-sm text-gray-600">{points}</span>
  </li>
);

export default Container;

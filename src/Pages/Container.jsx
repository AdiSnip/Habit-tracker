import React, { useEffect, useState } from "react";
import { Trophy, Users, CheckCircle } from "lucide-react";
import axios from "axios";

const Container = ({ data }) => {
  const [tasks, setTasks] = useState([]);
  const user = data?.[0];

  useEffect(() => {
    if (user) {
      // Fetch tasks from the backend
      axios.get("/api/readtask")
        .then((res) => {
          console.log("Fetched tasks:", res.data); // Log the data to check
          setTasks(res.data.tasks || []);
        })
        .catch((err) => {
          console.error("Failed to fetch tasks:", err);
        });
    }
  }, [user]);

  if (!user) return <div className="p-4 text-center text-gray-500">Loading...</div>;

  const progressPercent = (user.xp % 1000) / 10;

  // Compare only by date (ignore time part)
  const isToday = (dateString) => {
    const taskDate = new Date(dateString);
    const today = new Date();

    // Strip time from both dates for comparison
    taskDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return taskDate.getTime() === today.getTime();
  };

  const todaysTasks = tasks.filter(task => isToday(task.dueDate) && !task.isCompleted);

  return (
    <div className="min-h-screen bg-white p-6 text-black">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {user.firstname} 👋</h1>
          <p className="text-sm text-gray-600">Level {user.level} • {user.xp} XP</p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-xs mt-1 text-gray-500">Progress to next level</p>
        </div>

        <div className="flex items-center gap-4 mt-6 md:mt-0">
          <img
            src={user.avatar}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
          />
          <div className="flex flex-col">
            <span className="font-semibold">{user.username}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Tasks */}
        <div className="bg-gray-100 shadow-md rounded-2xl p-6 flex flex-col justify-between">
          <div className="mb-6">
            <h2 className="text-xl font-bold flex items-center mb-4">
              <CheckCircle className="mr-2 text-green-500" /> Today's Tasks
            </h2>

            {todaysTasks.length > 0 ? (
              <ul className="space-y-3">
                {todaysTasks.map((task, index) => (
                  <li key={index} className="bg-white p-3 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-sm">{task.title}</h3>
                    <p className="text-xs text-gray-500">{task.priority} Priority • Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No tasks due today 🎉</p>
            )}
          </div>

          <div className="text-center">
            <button className="mt-6 text-blue-600 hover:underline text-sm">View All Tasks</button>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gray-100 shadow-md rounded-2xl p-6 flex flex-col">
          <h2 className="text-xl font-bold flex items-center mb-6">
            <Trophy className="mr-2 text-purple-500" /> Achievements
          </h2>
          <div className="flex flex-col gap-4">
            <StatItem label="Badges Earned" value={user.badges.length} />
            <StatItem label="Streak" value={`${user.streak.current} days`} />
            <StatItem
              label="Daily Challenge"
              value={user.dailyChallengeCompleted ? "Completed" : "Incomplete"}
              color={user.dailyChallengeCompleted ? "text-green-600" : "text-red-500"}
            />
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-100 shadow-md rounded-2xl p-6 flex flex-col">
          <h2 className="text-xl font-bold flex items-center mb-6">
            <Users className="mr-2 text-blue-500" /> Leaderboard
          </h2>
          <ul className="space-y-4">
            <LeaderboardItem position="🥇" name="Jamie" points="3200 XP" />
            <LeaderboardItem position="🥈" name="Alex" points="2800 XP" />
            <LeaderboardItem position="🥉" name="Taylor" points="2500 XP" />
          </ul>
        </div>

      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 mt-10">
        “Consistency is more important than perfection.” 🚀
      </div>
    </div>
  );
};

const StatItem = ({ label, value, color = "text-black" }) => (
  <div className="flex justify-between items-center bg-white p-3 rounded-lg">
    <span className="text-sm">{label}</span>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

const LeaderboardItem = ({ position, name, points }) => (
  <li className="flex justify-between items-center p-3 bg-white rounded-lg hover:bg-gray-50 transition">
    <div className="flex items-center gap-2">
      <span className="text-lg">{position}</span>
      <span>{name}</span>
    </div>
    <span className="text-sm text-gray-500">{points}</span>
  </li>
);

export default Container;

import React from "react";
import { Trophy, Users, CheckCircle } from "lucide-react";

const Container = ({data}) => {
  if(!data) return
  let tasks = data[2];

  const userStats = {
    xp: 1200,
    level: 5,
    badges: 8,
    streak: 12,
    dailyChallengeCompleted: true,
    username: "Alex",
    avatar: "none", // Placeholder Avatar
  };

  const progressPercent = (data[0].xp % 1000) / 10;

  return (
    <div className="min-h-screen bg-white p-6 text-black">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {data[0].firstname} 👋</h1>
          <p className="text-sm text-gray-600">Level {data[0].level} • {data[0].xp} XP</p>

          {/* Progress */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-xs mt-1 text-gray-500">Progress to next level</p>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4 mt-6 md:mt-0">
          <img
            src={data[0].avatar}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
          />
          <div className="flex flex-col">
            <span className="font-semibold">{data[0].username}</span>
          </div>
        </div>

      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Section 1: Today's Tasks */}
{/* Section 1: Today's Tasks */}
<div className="bg-gray-100 shadow-md rounded-2xl p-6 flex flex-col justify-between">
  <div className="mb-6">
    <h2 className="text-xl font-bold flex items-center mb-4">
      <CheckCircle className="mr-2 text-green-500" /> Today's Tasks
    </h2>

    <ul className="space-y-4">
      {tasks
        .filter(task => new Date(task.createdAt).toDateString() === new Date().toDateString())
        .map(task => (
          <li
            key={task._id}
            className="p-4 bg-white rounded-xl flex justify-between items-center hover:bg-gray-50 transition"
          >
            <div>
              <p className="font-semibold text-gray-800">{task.title}</p>
              <span className="text-xs text-gray-500">{task.xpValue} XP</span>
            </div>
            <button className="text-green-600 hover:bg-green-100 border border-green-600 font-semibold text-sm py-1 px-3 rounded-full transition">
              Complete
            </button>
          </li>
        ))}
    </ul>
  </div>

  <div className="text-center">
    <button className="mt-6 text-blue-600 hover:underline text-sm">View All Tasks</button>
  </div>
</div>


        {/* Section 2: Achievements */}
        <div className="bg-gray-100 shadow-md rounded-2xl p-6 flex flex-col">
          <h2 className="text-xl font-bold flex items-center mb-6">
            <Trophy className="mr-2 text-purple-500" /> Achievements
          </h2>
          <div className="flex flex-col gap-4">
            <StatItem label="Badges Earned" value={data[0].badges.length} />
            <StatItem label="Streak" value={`${data[0].streak.current} days`} />
            {
              //this will be updating soon
            }
            <StatItem 
              label="Daily Challenge" 
              value={userStats.dailyChallengeCompleted ? "Completed" : "Incomplete"}
              color={userStats.dailyChallengeCompleted ? "text-green-600" : "text-red-500"}
            />
          </div>
        </div>

        {/* Section 3: Leaderboard */}
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

// Reusable Stat Item
const StatItem = ({ label, value, color = "text-black" }) => (
  <div className="flex justify-between items-center bg-white p-3 rounded-lg">
    <span className="text-sm">{label}</span>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

// Reusable Leaderboard Item
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

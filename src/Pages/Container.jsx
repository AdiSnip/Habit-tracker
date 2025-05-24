import React, { useEffect, useState } from "react";
import { Trophy, Users, CheckCircle } from "lucide-react";
import axios from "axios";

const Container = ({ data }) => {
  const [tasks, setTasks] = useState([]);
  const [progressPercent, setProgressPercent] = useState()
  const user = data?.[0];

  useEffect(() => {
    if (user) {
      axios
        .get("/api/readtask")
        .then((res) => setTasks(res.data.tasks || []))
        .catch((err) => console.error("Failed to fetch tasks:", err));
        setProgressPercent(
          ((user.xp / user.limitxp) * 100).toFixed(0)
        );
    }
  }, [user]);

  useEffect(() => {
    if (progressPercent === 100) {
      function handleLevelUp() {
        const newLevel = user.level + 1;
        const newLimitXp = user.limitxp * 2; // Example: double the limit XP for the next level
        const newXp = 0; // Reset XP after leveling up

        axios
          .put("/api/updateuser", {
            id: user._id,
            level: newLevel,
            limitxp: newLimitXp,
            xp: newXp,
          })
          .then(() => {
            console.log("User leveled up!");
          })
          .catch((err) => console.error("Failed to update user:", err));
      }
      handleLevelUp();
    }
  
  }, [progressPercent]);
  

  if (!user)
    return (
      <div className="p-4 text-center" style={{ color: "#a1a1aa" }}>
        Loading...
      </div>
    );


  const isToday = (dateString) => {
    const taskDate = new Date(dateString);
    const today = new Date();
    taskDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  };

  const todaysTasks = tasks.filter(
    (task) => isToday(task.dueDate) && !task.isCompleted
  );

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "black", color: "#f4f4f5" }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold" style={{ color: "#51FA15" }}>
            Welcome, {user.firstname} 👋
          </h1>
          <div className="flex items-center gap-3">
            <span
              className="text-sm font-semibold px-2 py-1 rounded-xl"
              style={{ backgroundColor: "#151515", color: "#51FA15" }}
            >
              Level {user.level}
            </span>
            <span className="text-sm" style={{ color: "#a1a1aa" }}>
              {user.xp}/{user.limitxp} XP
            </span>
          </div>
          <div
            className="mt-2 w-full rounded-full h-3"
            style={{ backgroundColor: "#151515" }}
          >
            <div
              className="h-3 rounded-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
                background: "#51FA15",
              }}
            />
          </div>
          <p className="text-xs mt-1" style={{ color: "#a1a1aa" }}>
            Progress to next level
          </p>
        </div>

        <div
          className="flex items-center gap-4 mt-6 md:mt-0 p-2 rounded-full shadow-md"
          style={{ backgroundColor: "#151515" }}
        >
          <img
            src={user.avatar}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2"
            style={{ borderColor: "#51FA15" }}
          />
          <div>
            <p style={{ color: "#f4f4f5", fontWeight: "600" }}>
              {user.username}
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Today's Tasks Card */}
        <Card>
          <SectionHeader icon={<CheckCircle style={{ color: "#51FA15" }} />} title="Today's Tasks" />
          <div className="flex flex-col justify-between h-full">
            {todaysTasks.length > 0 ? (
              <ul className="space-y-3 mb-4">
                {todaysTasks.map((task, i) => (
                  <li
                    key={i}
                    className="p-3 rounded-xl hover:cursor-pointer transition"
                    style={{
                      backgroundColor: "#151515",
                      color: "#51FA15",
                    }}
                  >
                    <h3 className="font-semibold text-sm">{task.title}</h3>
                    <p className="text-xs" style={{ color: "#a1a1aa" }}>
                      {task.priority} Priority • Due:{" "}
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm mb-4" style={{ color: "#a1a1aa" }}>
                No tasks due today 🎉
              </p>
            )}
            <button
              className="text-sm hover:underline"
              style={{ color: "#51FA15" }}
            >
              View All Tasks
            </button>
          </div>
        </Card>

        {/* Achievements Card */}
        <Card>
          <SectionHeader icon={<Trophy style={{ color: "#51FA15" }} />} title="Achievements" />
          <div className="flex flex-col gap-4 mt-2">
            <StatItem label="Badges Earned" value={user.badges.length} />
            <StatItem label="Streak" value={`${user.streak.current} days`} />
            <StatItem
              label="Daily Challenge"
              value={user.dailyChallengeCompleted ? "Completed" : "Incomplete"}
              color={user.dailyChallengeCompleted ? "#51FA15" : "#f43f5e"}
            />
          </div>
        </Card>

        {/* Leaderboard Card */}
        <Card>
          <SectionHeader icon={<Users style={{ color: "#51FA15" }} />} title="Leaderboard" />
          <ul className="space-y-4 mt-2">
            <LeaderboardItem position="🥇" name="Jamie" points="3200 XP" />
            <LeaderboardItem position="🥈" name="Alex" points="2800 XP" />
            <LeaderboardItem position="🥉" name="Taylor" points="2500 XP" />
          </ul>
        </Card>
      </div>

      <p className="text-center text-xs mt-10 italic" style={{ color: "#a1a1aa" }}>
        “Consistency beats intensity.” 🚀
      </p>
    </div>
  );
};

const Card = ({ children }) => (
  <div
    className="rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-all border border-[#51FA15]"
    style={{ backgroundColor: "black" }}
  >
    {children}
  </div>
);

const SectionHeader = ({ icon, title }) => (
  <h2 className="text-xl font-bold flex items-center gap-2 mb-4" style={{ color: "#f4f4f5" }}>
    {icon} {title}
  </h2>
);

const StatItem = ({ label, value, color = "#51FA15" }) => (
  <div
    className="flex justify-between items-center p-3 rounded-xl shadow-sm"
    style={{ backgroundColor: "#121212" }}
  >
    <span className="text-sm" style={{ color: "#a1a1aa" }}>
      {label}
    </span>
    <span className="font-semibold" style={{ color }}>
      {value}
    </span>
  </div>
);

const LeaderboardItem = ({ position, name, points }) => (
  <li
    className="flex justify-between items-center p-3 rounded-xl hover:cursor-pointer transition"
    style={{
      backgroundColor: "#151515",
      color: "#f4f4f5",
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.backgroundColor = "rgba(81, 250, 21, 0.1)")
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.backgroundColor = "#151515")
    }
  >
    <div className="flex items-center gap-2 font-medium">
      <span className="text-xl">{position}</span>
      <span>{name}</span>
    </div>
    <span className="text-sm" style={{ color: "#a1a1aa" }}>
      {points}
    </span>
  </li>
);

export default Container;

import React, { useEffect, useState, useCallback } from "react";
import { Trophy, Users, CheckCircle } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

const Container = ({ data }) => {
  const [tasks, setTasks] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [user, setUser] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [levelingUp, setLevelingUp] = useState(false);
  const [error, setError] = useState(null);

  // Set user from data prop safely
  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setUser(data[0]);
    }
  }, [data]);

  // Fetch tasks when user is set
  useEffect(() => {
    if (!user) return;
    setLoadingTasks(true);
    setError(null);

    axios
      .get("/api/readtask")
      .then((res) => {
        setTasks(res.data.tasks || []);
        setLoadingTasks(false);
      })
      .catch((err) => {
        console.error("Failed to fetch tasks:", err);
        setError("Failed to load tasks");
        setLoadingTasks(false);
      });
  }, [user]);

  // Calculate progress percent safely as number between 0-100
  useEffect(() => {
    if (user?.xp !== undefined && user?.limitxp) {
      const progress = Math.min(
        100,
        Math.max(0, (user.xp / user.limitxp) * 100)
      );
      setProgressPercent(progress);
    } else {
      setProgressPercent(0);
    }
  }, [user]);

  // Handle level up only once per 100% progress
  const handleLevelUp = useCallback(() => {
    if (!user || levelingUp) return;
    setLevelingUp(true);

    const newLevel = user.level + 1;
    const newLimitXp = user.limitxp * 2;

    axios
      .put("/api/updateuser", {
        id: user._id,
        level: newLevel,
        limitxp: newLimitXp,
        xp: 0,
      })
      .then(() => {
        // Update local user state to reflect changes
        setUser((prev) => ({
          ...prev,
          level: newLevel,
          limitxp: newLimitXp,
          xp: 0,
        }));
        setLevelingUp(false);
        console.log("User leveled up!");
      })
      .catch((err) => {
        console.error("Failed to update user:", err);
        setLevelingUp(false);
      });
  }, [user, levelingUp]);

  useEffect(() => {
    if (progressPercent >= 100) {
      handleLevelUp();
    }
  }, [progressPercent, handleLevelUp]);

  if (!user) {
    return (
      <div
        className="p-6 text-center text-gray-400"
        aria-live="polite"
        aria-busy="true"
      >
        Loading user data...
      </div>
    );
  }

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
    <div className="min-h-screen p-6 bg-black text-gray-100">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
        aria-label="User dashboard header"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-lime-400">
            Welcome, {user.firstname} 👋
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold px-2 py-1 rounded-xl bg-gray-900 text-lime-400">
              Level {user.level}
            </span>
            <span className="text-sm text-gray-400">
              {user.xp}/{user.limitxp} XP
            </span>
          </div>

          <div className="mt-2 w-full rounded-full h-3 bg-gray-900">
            <motion.div
              className="h-3 rounded-full bg-lime-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6 }}
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
            />
          </div>

          <p className="text-xs mt-1 text-gray-400">Progress to next level</p>
        </div>

        <div
          className="flex items-center gap-4 mt-6 md:mt-0 p-2 rounded-full shadow-md bg-gray-900"
          aria-label="User profile"
        >
          <img
            src={user.avatar}
            alt={`${user.firstname} avatar`}
            className="w-12 h-12 rounded-full object-cover border-2 border-lime-400"
            loading="lazy"
          />
          <div>
            <p className="text-gray-100 font-semibold">{user.username}</p>
          </div>
        </div>
      </motion.header>

      {/* Grid Section */}
      <motion.section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.2 },
          },
        }}
        aria-label="User statistics and tasks"
      >
        <AnimatedCard>
          <SectionHeader
            icon={<CheckCircle className="text-lime-400" />}
            title="Today's Tasks"
          />
          <div className="flex flex-col justify-between h-full">
            {loadingTasks ? (
              <p className="text-gray-400">Loading tasks...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : todaysTasks.length > 0 ? (
              <ul className="space-y-3 mb-4" role="list">
                {todaysTasks.map((task, i) => (
                  <li
                    key={task._id || i}
                    className="p-3 rounded-xl bg-gray-900 text-lime-400 hover:cursor-pointer transition"
                    tabIndex={0}
                    aria-label={`Task: ${task.title}, Priority: ${task.priority}, Due date: ${new Date(
                      task.dueDate
                    ).toLocaleDateString()}`}
                  >
                    <h3 className="font-semibold text-sm">{task.title}</h3>
                    <p className="text-xs text-gray-400">
                      {task.priority} Priority • Due:{" "}
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm mb-4 text-gray-400">No tasks due today 🎉</p>
            )}
            <button
              className="text-sm hover:underline text-lime-400 self-start"
              onClick={() => alert("View all tasks clicked!")}
              aria-label="View all tasks"
              type="button"
            >
              View All Tasks
            </button>
          </div>
        </AnimatedCard>

        <AnimatedCard>
          <SectionHeader
            icon={<Trophy className="text-lime-400" />}
            title="Achievements"
          />
          <div className="flex flex-col gap-4 mt-2">
            <StatItem label="Badges Earned" value={user.badges?.length || 0} />
            <StatItem label="Streak" value={`${user.streak?.current || 0} days`} />
            <StatItem
              label="Daily Challenge"
              value={user.dailyChallengeCompleted ? "Completed" : "Incomplete"}
              color={user.dailyChallengeCompleted ? "#51FA15" : "#f43f5e"}
            />
          </div>
        </AnimatedCard>

        <AnimatedCard>
          <SectionHeader
            icon={<Users className="text-lime-400" />}
            title="Leaderboard"
          />
          <ul className="space-y-4 mt-2" role="list">
            <LeaderboardItem position="🥇" name="Jamie" points="3200 XP" />
            <LeaderboardItem position="🥈" name="Alex" points="2800 XP" />
            <LeaderboardItem position="🥉" name="Taylor" points="2500 XP" />
          </ul>
        </AnimatedCard>
      </motion.section>

      <p className="text-center text-xs mt-10 italic text-gray-400">
        “Consistency beats intensity.” 🚀
      </p>
    </div>
  );
};

const Card = ({ children }) => (
  <div className="rounded-3xl shadow-xl p-6 border border-lime-400 bg-black">
    {children}
  </div>
);

const AnimatedCard = ({ children }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
  >
    <Card>{children}</Card>
  </motion.div>
);

const SectionHeader = ({ icon, title }) => (
  <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-100">
    {icon} {title}
  </h2>
);

const StatItem = ({ label, value, color = "#51FA15" }) => (
  <div className="flex justify-between items-center p-3 rounded-xl shadow-sm bg-gray-900">
    <span className="text-sm text-gray-400">{label}</span>
    <span className="font-semibold" style={{ color }}>
      {value}
    </span>
  </div>
);

const LeaderboardItem = ({ position, name, points }) => (
  <li
    className="flex justify-between items-center p-3 rounded-xl transition bg-gray-900 text-gray-100 hover:bg-lime-100 hover:bg-opacity-10 cursor-pointer"
    tabIndex={0}
    aria-label={`${position} place: ${name}, Points: ${points}`}
  >
    <div className="flex items-center gap-2 font-medium">
      <span className="text-xl">{position}</span>
      <span>{name}</span>
    </div>
    <span className="text-sm text-gray-400">{points}</span>
  </li>
);

export default Container;

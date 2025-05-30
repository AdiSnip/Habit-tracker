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
    if (!dateString) return false;
    const taskDate = new Date(dateString);
    const today = new Date();
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  };

  const todaysTasks = tasks.filter((task) => {
    return isToday(task.dueDate) && !task.isCompleted;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-black via-gray-900 to-black text-gray-100"
    >
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-10 backdrop-blur-lg bg-black/30 p-4 sm:p-6 md:p-8 rounded-2xl border border-lime-400/20"
      >
        <div className="space-y-3 md:space-y-4 w-full lg:w-auto">
          <motion.h1 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent"
          >
            Welcome, {user.firstname} 👋
          </motion.h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs sm:text-sm font-semibold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gray-900/50 text-lime-400 border border-lime-400/20">
              Level {user.level}
            </span>
            <span className="text-xs sm:text-sm text-gray-300 bg-gray-900/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl">
              {user.xp}/{user.limitxp} XP
            </span>
          </div>

          <div className="mt-2 md:mt-4 w-full max-w-md rounded-full h-3 md:h-4 bg-gray-900/50 backdrop-blur-sm p-0.5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-lime-400 to-green-500 shadow-[0_0_15px] shadow-lime-500/50"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-4 mt-4 lg:mt-0 p-3 sm:p-4 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-lime-400/20 hover:border-lime-400/40 transition-all duration-300 w-full lg:w-auto"
        >
          <img
            src={user.avatar}
            alt={`${user.firstname} avatar`}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-lime-400 shadow-lg shadow-lime-400/20"
            loading="lazy"
          />
          <div>
            <p className="text-base sm:text-lg text-gray-100 font-semibold">{user.username}</p>
          </div>
        </motion.div>
      </motion.header>

      <motion.section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } }
        }}
        initial="hidden"
        animate="visible"
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
    </motion.div>
  );
};

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <span className="text-2xl">{icon}</span>
    <h2 className="text-xl font-bold text-gray-100">{title}</h2>
  </div>
);

const AnimatedCard = ({ children }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
  >
    <Card>{children}</Card>
  </motion.div>
);

const Card = ({ children }) => (
  <div className="rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 border border-lime-400/20 bg-gray-900/30 backdrop-blur-lg hover:border-lime-400/40 transition-all duration-300">
    {children}
  </div>
);

const StatItem = ({ label, value, color = "#51FA15" }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-lime-400/10 hover:border-lime-400/30 transition-all duration-300"
  >
    <span className="text-xs sm:text-sm text-gray-300">{label}</span>
    <span className="text-sm sm:text-base font-semibold" style={{ color }}>
      {value}
    </span>
  </motion.div>
);

const LeaderboardItem = ({ position, name, points }) => (
  <motion.li
    whileHover={{ scale: 1.02 }}
    className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-gray-900/50 border border-lime-400/10 hover:border-lime-400/30 text-gray-100 transition-all duration-300"
  >
    <div className="flex items-center gap-2 sm:gap-3 font-medium">
      <span className="text-xl sm:text-2xl">{position}</span>
      <span className="text-sm sm:text-base text-gray-200">{name}</span>
    </div>
    <span className="text-xs sm:text-sm font-semibold text-lime-400">{points}</span>
  </motion.li>
);

export default Container;

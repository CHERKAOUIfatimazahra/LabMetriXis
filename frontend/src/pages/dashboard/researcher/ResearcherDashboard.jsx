import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaClipboardList,
  FaUsers,
  FaFileAlt,
  FaBell,
  FaSearch,
} from "react-icons/fa";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { motion } from "framer-motion";

export const ResearcherDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Navigation items config
  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <FaChartLine />,
      navigator: "/dashboard/researcher",
    },
    {
      id: "projects",
      label: "Projects",
      icon: <FaClipboardList />,
      navigator: "/dashboard/researcher/projects",
    },
    {
      id: "team",
      label: "Research Team",
      icon: <FaUsers />,
      navigator: "/dashboard/researcher/team",
    },
    {
      id: "publications",
      label: "Publications",
      icon: <FaFileAlt />,
      navigator: "/dashboard/researcher/publications",
    },
    {
      id: "profile",
      label: "Profile",
      icon: <FaUsers />,
      navigator: "/dashboard/researcher/profile",
    },
  ];

  // Quick stats config
  const quickStats = [
    {
      id: 1,
      label: "Active Projects",
      value: "8",
      color: "blue",
      icon: <FaClipboardList />,
    },
    {
      id: 2,
      label: "Publications",
      value: "12",
      color: "green",
      icon: <FaFileAlt />,
    },
    {
      id: 3,
      label: "Team Members",
      value: "15",
      color: "purple",
      icon: <FaUsers />,
    },
    {
      id: 4,
      label: "Pending Reviews",
      value: "3",
      color: "amber",
      icon: <FaBell />,
    },
  ];

  // Données pour les projets récents
  const recentProjects = [
    {
      id: 1,
      name: "Quantum Computing Research",
      status: "In Progress",
      deadline: "March 15, 2025",
      progress: 65,
    },
    {
      id: 2,
      name: "Neural Network Analysis",
      status: "Completed",
      deadline: "January 30, 2025",
      progress: 100,
    },
    {
      id: 3,
      name: "Sustainable Materials Study",
      status: "Pending Review",
      deadline: "April 10, 2025",
      progress: 45,
    },
    {
      id: 4,
      name: "Climate Change Impact Analysis",
      status: "In Progress",
      deadline: "May 22, 2025",
      progress: 30,
    },
  ];

  // Données pour les notifications
  const notifications = [
    {
      id: 1,
      message: "Meeting with research team scheduled for tomorrow at 10 AM",
      time: "2 hours ago",
      type: "info",
    },
    {
      id: 2,
      message:
        "Project 'Neural Network Analysis' has been approved for publication",
      time: "Yesterday",
      type: "success",
    },
    {
      id: 3,
      message: "Equipment maintenance scheduled for Lab B on Friday",
      time: "2 days ago",
      type: "warning",
    },
  ];

  // Animations variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Animation pour les chiffres des statistiques
  const numberAnimation = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        delay: 0.3,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-t-4 border-teal-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-teal-800 font-medium">
            Chargement du dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Component avec effet de glassmorphism */}
      <Header
        title="Research Lab Portal"
        userName="Dr. Roberts"
        userInitials="DR"
        notificationCount={3}
        bgColor="bg-teal-700 backdrop-filter backdrop-blur-lg bg-opacity-90"
        hoverColor="text-teal-200"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Component */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              navItems={navItems}
              quickStats={quickStats}
              accentColor="teal"
              statsTitle="QUICK STATS"
            />
          </motion.div>

          {/* Main Dashboard Content */}
          <main className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-xl p-6 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-8">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-2xl font-bold text-teal-800"
                >
                  <span className="border-b-4 border-teal-500 pb-1">
                    Researcher Dashboard
                  </span>
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="relative"
                >
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 bg-gray-50 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                  />
                </motion.div>
              </div>

              {/* Statistics Cards */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-lg shadow-lg relative overflow-hidden"
                >
                  <div className="absolute right-0 top-0 w-20 h-20 bg-white opacity-10 rounded-bl-full"></div>
                  <h3 className="text-lg font-medium mb-2">
                    Research Progress
                  </h3>
                  <motion.p
                    variants={numberAnimation}
                    initial="initial"
                    animate="animate"
                    className="text-4xl font-bold"
                  >
                    68%
                  </motion.p>
                  <p className="text-sm opacity-80 mt-2">
                    4 milestones completed
                  </p>
                  <div className="mt-4 bg-white bg-opacity-20 h-2 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "68%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-white h-2 rounded-full"
                    ></motion.div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg relative overflow-hidden"
                >
                  <div className="absolute right-0 top-0 w-20 h-20 bg-white opacity-10 rounded-bl-full"></div>
                  <h3 className="text-lg font-medium mb-2">Lab Resources</h3>
                  <motion.p
                    variants={numberAnimation}
                    initial="initial"
                    animate="animate"
                    className="text-4xl font-bold"
                  >
                    85%
                  </motion.p>
                  <p className="text-sm opacity-80 mt-2">
                    15/20 equipment available
                  </p>
                  <div className="mt-4 bg-white bg-opacity-20 h-2 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="bg-white h-2 rounded-full"
                    ></motion.div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg relative overflow-hidden"
                >
                  <div className="absolute right-0 top-0 w-20 h-20 bg-white opacity-10 rounded-bl-full"></div>
                  <h3 className="text-lg font-medium mb-2">Research Funding</h3>
                  <motion.p
                    variants={numberAnimation}
                    initial="initial"
                    animate="animate"
                    className="text-4xl font-bold"
                  >
                    $248K
                  </motion.p>
                  <p className="text-sm opacity-80 mt-2">
                    Budget remaining: $142K
                  </p>
                  <div className="mt-4 bg-white bg-opacity-20 h-2 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "63%" }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="bg-white h-2 rounded-full"
                    ></motion.div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Recent Projects */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-8"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-teal-500 pl-3">
                  Recent Projects
                </h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deadline
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentProjects.map((project, index) => (
                        <motion.tr
                          key={project.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          whileHover={{
                            backgroundColor: "rgba(237, 242, 247, 0.5)",
                          }}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-teal-100 text-teal-600 rounded-md flex items-center justify-center">
                                <FaClipboardList />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {project.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 text-xs rounded-full ${
                                project.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : project.status === "In Progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {project.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {project.deadline}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <motion.div
                                className={`h-2.5 rounded-full ${
                                  project.progress >= 80
                                    ? "bg-green-500"
                                    : project.progress >= 50
                                    ? "bg-blue-500"
                                    : "bg-yellow-500"
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${project.progress}%` }}
                                transition={{
                                  duration: 1,
                                  delay: 0.5 + index * 0.1,
                                }}
                              ></motion.div>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">
                              {project.progress}%
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors duration-300 py-2 px-4 rounded-md text-sm font-medium flex items-center float-right"
                >
                  View All Projects
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              </motion.div>

              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-teal-500 pl-3">
                  Recent Notifications
                </h3>
                <div className="space-y-3">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 * index + 0.7 }}
                      whileHover={{ x: 5 }}
                      className={`p-4 rounded-md border-l-4 shadow-sm ${
                        notification.type === "success"
                          ? "bg-green-50 border-green-500"
                          : notification.type === "warning"
                          ? "bg-yellow-50 border-yellow-500"
                          : "bg-blue-50 border-blue-500"
                      } transition-all duration-200`}
                    >
                      <div className="flex">
                        <div
                          className={`flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full ${
                            notification.type === "success"
                              ? "bg-green-100 text-green-600"
                              : notification.type === "warning"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          <FaBell className="h-4 w-4" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-800">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors duration-300 py-2 px-4 rounded-md text-sm font-medium flex items-center"
                >
                  View all notifications
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ResearcherDashboard;

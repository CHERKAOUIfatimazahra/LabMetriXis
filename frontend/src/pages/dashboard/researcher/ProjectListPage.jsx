import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaClipboardList,
  FaUsers,
  FaFileAlt,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaDollarSign,
  FaFlask,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { toast } from "react-toastify";

function ProjectListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [projects, setProjects] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

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

  useEffect(() => {
    fetchProjects();
    fetchStatistics();
  }, [searchTerm, filterStatus, pagination.currentPage]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/project/projects/search`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            query: searchTerm,
            status: filterStatus,
            page: pagination.currentPage,
            limit: 10,
          },
        }
      );

      setProjects(response.data.projects);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total,
      });
    } catch (error) {
      toast.error("Failed to fetch projects");
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/project/projects/statistics`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Active":
        return "bg-blue-100 text-blue-800";
      case "Planning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 40) return "bg-blue-500";
    return "bg-yellow-500";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-t-4 border-teal-600 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-teal-800 font-medium">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header
        title="Research Lab Portal"
        userName="Dr. Roberts"
        userInitials="DR"
        notificationCount={3}
        bgColor="bg-teal-700 backdrop-filter backdrop-blur-lg bg-opacity-90"
        hoverColor="text-teal-200"
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div>
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              navItems={navItems}
              accentColor="teal"
            />
          </div>

          <main className="flex-1">
            {/* Statistics Section */}
            {statistics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-16 h-16 bg-white opacity-10 rounded-bl-full"></div>
                  <h3 className="text-sm font-medium mb-1">Total Projects</h3>
                  <p className="text-3xl font-bold">
                    {statistics.totalProjects}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-lg shadow relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-16 h-16 bg-white opacity-10 rounded-bl-full"></div>
                  <h3 className="text-sm font-medium mb-1">Active Projects</h3>
                  <p className="text-3xl font-bold">
                    {statistics.statusDistribution?.Active || 0}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-16 h-16 bg-white opacity-10 rounded-bl-full"></div>
                  <h3 className="text-sm font-medium mb-1">Total Budget</h3>
                  <p className="text-3xl font-bold">
                    $
                    {statistics.budgetStatistics?.totalBudget?.toLocaleString() ||
                      0}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-16 h-16 bg-white opacity-10 rounded-bl-full"></div>
                  <h3 className="text-sm font-medium mb-1">Total Samples</h3>
                  <p className="text-3xl font-bold">
                    {Object.values(statistics.sampleStatistics || {}).reduce(
                      (a, b) => a + b,
                      0
                    )}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-xl p-6 border border-gray-100">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-teal-800">
                  <span className="border-b-4 border-teal-500 pb-1">
                    Research Projects
                  </span>
                </h1>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative flex-grow">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="pl-10 pr-4 py-2 w-full bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={filterStatus}
                      onChange={handleStatusFilter}
                      className="appearance-none pl-10 pr-10 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Planning">Planning</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>

                  <button
                    onClick={() =>
                      navigate("/dashboard/researcher/projects/create")
                    }
                    className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg flex items-center justify-center shadow-md transition-all duration-300"
                  >
                    <FaPlus className="w-4 h-4 mr-2" />
                    New Project
                  </button>
                </div>
              </div>

              {/* Projects Table */}
              <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team Lead
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timeline
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects.length > 0 ? (
                      projects.map((project) => (
                        <tr
                          key={project._id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">
                                <FaClipboardList size={18} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {project.projectName}
                                </div>
                                <div className="text-xs text-gray-500 mt-1 max-w-xs">
                                  {project.description}
                                </div>
                                <div className="text-xs text-teal-600 mt-1">
                                  Budget: ${project.budget.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col items-start space-y-2">
                              <span
                                className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                                  project.status
                                )}`}
                              >
                                {project.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-teal-200 text-teal-600 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  {project.teamLeadName
                                    .split(" ")
                                    .map((name) => name[0])
                                    .join("")}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {project.teamLeadName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <div className="flex items-center text-xs text-gray-700">
                                <span className="font-medium">Start:</span>
                                <span className="ml-2">
                                  {new Date(
                                    project.startDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center text-xs text-gray-700 mt-1">
                                <span className="font-medium">End:</span>
                                <span className="ml-2">
                                  {new Date(
                                    project.deadline
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-full">
                              <div className="flex justify-between mb-1">
                                <span className="text-xs font-medium text-gray-700">
                                  {project.progress}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getProgressColor(
                                    project.progress
                                  )}`}
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/dashboard/researcher/projects/${project._id}`
                                  )
                                }
                                className="p-2 text-blue-600 hover:text-blue-800 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-200"
                              >
                                <FaEye size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  navigate(
                                    `/dashboard/researcher/projects/${project._id}/edit`
                                  )
                                }
                                className="p-2 text-yellow-600 hover:text-yellow-800 bg-yellow-100 rounded-full hover:bg-yellow-200 transition-colors duration-200"
                              >
                                <FaEdit size={16} />
                              </button>
                              <button className="p-2 text-red-600 hover:text-red-800 bg-red-100 rounded-full hover:bg-red-200 transition-colors duration-200">
                                <FaTrash size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-10 text-center text-gray-500"
                        >
                          No projects found matching your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(pagination.currentPage - 1) * 10 + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(pagination.currentPage * 10, pagination.total)}
                  </span>{" "}
                  of <span className="font-medium">{pagination.total}</span>{" "}
                  projects
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`px-4 py-2 ${
                      pagination.currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } rounded-md transition-colors duration-200`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`px-4 py-2 ${
                      pagination.currentPage === pagination.totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-teal-500 text-white hover:bg-teal-600"
                    } rounded-md transition-colors duration-200`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProjectListPage;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header";
import Sidebar from "../../../../components/Sidebar";
import {
  FaChartLine,
  FaClipboardList,
  FaUsers,
  FaFileAlt,
  FaUserPlus,
} from "react-icons/fa";
import axios from "axios";

function ProjectCreatePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    projectName: "",
    researchDomains: "",
    teamLead: "",
    fundingSource: "",
    budget: "",
    startDate: "",
    deadline: "",
    status: "Planning",
    collaboratingInstitutions: "",
    ethicsApproval: false,
    ethicsApprovalRef: "",
    description: "",
    expectedOutcomes: "",
    samples: [],
  });

  // Fetch available users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/project/available-team-members`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAvailableUsers(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle adding team member
  const handleAddTeamMember = () => {
    if (selectedMember) {
      const memberToAdd = availableUsers.find((m) => m._id === selectedMember);
      if (
        memberToAdd &&
        !selectedTeamMembers.some((m) => m._id === memberToAdd._id)
      ) {
        setSelectedTeamMembers([...selectedTeamMembers, memberToAdd]);
        setSelectedMember("");
      }
    }
  };

  // Handle removing team member
  const handleRemoveTeamMember = (memberId) => {
    setSelectedTeamMembers(
      selectedTeamMembers.filter((member) => member._id !== memberId)
    );
  };

  // Extended research domains list
  const researchDomains = [
    "Biologie",
    "Chimie",
    "Physique",
    "Biochimie",
    "Neurosciences",
    "Géologie",
    "Informatique",
  ];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      // Format team members data for the API
      const formattedTeamMembers = selectedTeamMembers.map((member) => ({
        user: member._id,
        role: member.role,
      }));

      const finalFormData = {
        ...formData,
        teamLead: formData.teamLead, // This should be a user ID
        teamMembers: formattedTeamMembers,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/project/project`,
        finalFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        const { project, projectId } = response.data;
        navigate(
          `/dashboard/researcher/projects/create/add-sample/${projectId}`
        );
      }
    } catch (error) {
      console.error("Error creating project:", error);
      if (error.response?.status === 403) {
        alert(
          "You don't have permission to create projects. Only researchers can create projects."
        );
      } else {
        alert("Failed to create project. Please try again.");
      }
    }
  };

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
      label: "Projets actifs",
      value: "8",
      color: "teal",
    },
    {
      id: 2,
      label: "Échantillons",
      value: "126",
      color: "indigo",
    },
    {
      id: 3,
      label: "Publications",
      value: "12",
      color: "green",
    },
    {
      id: 4,
      label: "Analyses en attente",
      value: "7",
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Component */}
      <Header
        title="LabMetriXis - Recherche Scientifique"
        userName="Dr. Roberts"
        userInitials="DR"
        notificationCount={3}
        bgColor="bg-teal-700"
        hoverColor="text-teal-200"
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Component */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            navItems={navItems}
            quickStats={quickStats}
            accentColor="teal"
          />

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Créer un nouveau projet de recherche
                </h1>
                <div>
                  <span className="text-sm text-gray-500">
                    * Champs obligatoires
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Informations de base du projet */}
                <div>
                  <h2 className="text-lg font-semibold text-teal-700 mb-4">
                    Informations générales du projet
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="projectName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Titre du projet de recherche*
                      </label>
                      <input
                        type="text"
                        id="projectName"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="researchDomain"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Domaine de recherche*
                      </label>
                      <select
                        id="researchDomain"
                        name="researchDomains"
                        value={formData.researchDomain}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      >
                        <option value="">-- Choisissez un domaine --</option>
                        {researchDomains.map((domain) => (
                          <option key={domain} value={domain}>
                            {domain}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="fundingSource"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Source de financement
                      </label>
                      <input
                        type="text"
                        id="fundingSource"
                        name="fundingSource"
                        value={formData.fundingSource}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Ex: ANR, ERC, Privé..."
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="budget"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Budget (DH)*
                      </label>
                      <input
                        type="number"
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="startDate"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Date de début*
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="deadline"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Date de fin prévue*
                      </label>
                      <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Résumé du projet*
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                      placeholder="Décrivez brièvement les objectifs et la portée de ce projet de recherche..."
                    ></textarea>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="expectedOutcomes"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Résultats attendus
                    </label>
                    <textarea
                      id="expectedOutcomes"
                      name="expectedOutcomes"
                      value={formData.expectedOutcomes}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Décrivez les résultats attendus et les impacts potentiels de cette recherche..."
                    ></textarea>
                  </div>
                </div>

                {/* Section Équipe de recherche */}
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold text-teal-700 mb-4">
                    <FaUsers className="inline mr-2" /> Équipe de recherche
                  </h2>
                  <div className="mb-4">
                    <label
                      htmlFor="teamLead"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Responsable du projet*
                    </label>
                    <select
                      id="teamLead"
                      name="teamLead"
                      value={formData.teamLead}
                      onChange={handleChange}
                      className="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    >
                      <option value="">Sélectionner un responsable</option>
                      {availableUsers
                        .filter((user) => user.role === "chercheur")
                        .map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.name} - {user.institution}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Team Members Selection */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="w-full md:w-80">
                      <label
                        htmlFor="teamMember"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Ajouter un membre
                      </label>
                      <div className="flex gap-2">
                        <select
                          id="teamMember"
                          value={selectedMember}
                          onChange={(e) => setSelectedMember(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="">
                            Sélectionner un collaborateur
                          </option>
                          {availableUsers.map((user) => (
                            <option key={user._id} value={user._id}>
                              {user.name} - {user.role}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={handleAddTeamMember}
                          className="px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-150"
                          aria-label="Ajouter un membre"
                        >
                          <FaUserPlus />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Team Members Table */}
                  {selectedTeamMembers.length > 0 && (
                    <div className="overflow-x-auto mt-4">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="py-2 px-4 border-b text-left">
                              Nom
                            </th>
                            <th className="py-2 px-4 border-b text-left">
                              Rôle
                            </th>
                            <th className="py-2 px-4 border-b text-left">
                              Spécialité
                            </th>
                            <th className="py-2 px-4 border-b text-left">
                              Institution
                            </th>
                            <th className="py-2 px-4 border-b text-center w-24">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTeamMembers.map((member) => (
                            <tr key={member._id} className="hover:bg-gray-50">
                              <td className="py-2 px-4 border-b font-medium">
                                {member.name}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {member.role}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {member.specialty}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {member.institution}
                              </td>
                              <td className="py-2 px-4 border-b text-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveTeamMember(member._id)
                                  }
                                  className="text-red-500 hover:text-red-700 transition duration-150"
                                  aria-label="Retirer ce membre"
                                >
                                  Retirer
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="mt-4">
                    <label
                      htmlFor="collaboratingInstitutions"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Institutions collaboratrices
                    </label>
                    <input
                      type="text"
                      id="collaboratingInstitutions"
                      name="collaboratingInstitutions"
                      value={formData.collaboratingInstitutions}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Séparez les institutions par des virgules"
                    />
                  </div>
                </div>

                {/* Boutons de soumission */}
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/researcher/projects")}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-150"
                  >
                    Ajouter l'échantillon
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProjectCreatePage;

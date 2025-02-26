import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../../components/Header";
import Sidebar from "../../../../components/Sidebar";
import { useParams } from "react-router-dom";
import {
  FaChartLine,
  FaClipboardList,
  FaUsers,
  FaFileAlt,
  FaFlask,
  FaUserPlus,
  FaUpload,
  FaVial,
} from "react-icons/fa";
import axios from "axios";

function AddSample() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  onsole.log("Project ID from params:", projectId);
  const [project, setProject] = useState(null);

  const [activeTab, setActiveTab] = useState("projects");
  const [protocolFile, setProtocolFile] = useState(null);
  const [availableTeamMembers, setAvailableTeamMembers] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [storageConditions, setStorageConditions] = useState([]);
  const [storageLocations, setStorageLocations] = useState([]);

  // Initial form data state
  const [formData, setFormData] = useState({
    samples: [],

    // New samples properties
    currentSample: {
      identification: "",
      type: "",
      quantity: "",
      storageConditions: [],
      storageLocation: [],
      technician: "",
      collectionDate: "",
      expirationDate: "",
      protocolFile: null,
      status: "Available",
    },
  });

  // Handle sample form changes
  const handleSampleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        currentSample: {
          ...formData.currentSample,
          [name]: files[0],
        },
      });
      setProtocolFile(files[0]);
    } else {
      setFormData({
        ...formData,
        currentSample: {
          ...formData.currentSample,
          [name]: value,
        },
      });
    }
  };

  // Handle adding a new sample
  const handleAddSample = () => {
    if (
      !formData.currentSample.identification ||
      !formData.currentSample.type ||
      !formData.currentSample.quantity
    ) {
      alert("Veuillez remplir les champs obligatoires de l'échantillon");
      return;
    }

    // Add current sample to samples array
    setFormData({
      ...formData,
      samples: [
        ...formData.samples,
        {
          ...formData.currentSample,
          id: Date.now(), // generate a temporary unique ID
        },
      ],
      // Reset current sample form
      currentSample: {
        identification: "",
        type: "",
        quantity: "",
        storageConditions: [],
        storageLocation: [],
        technician: "",
        collectionDate: "",
        expirationDate: "",
        protocolFile: null,
        status: "Available",
      },
    });

    // Reset protocol file state
    setProtocolFile(null);
  };

  // Handle removing a sample
  const handleRemoveSample = (sampleId) => {
    setFormData({
      ...formData,
      samples: formData.samples.filter((sample) => sample.id !== sampleId),
    });
  };

  // Handle removing storage condition from current sample
  const handleRemoveStorageCondition = (condition) => {
    setFormData({
      ...formData,
      currentSample: {
        ...formData.currentSample,
        storageConditions: formData.currentSample.storageConditions.filter(
          (c) => c !== condition
        ),
      },
    });
  };

  // Handle removing storage location from current sample
  const handleRemoveStorageLocation = (location) => {
    setFormData({
      ...formData,
      currentSample: {
        ...formData.currentSample,
        storageLocation: formData.currentSample.storageLocation.filter(
          (l) => l !== location
        ),
      },
    });
  };

  // Handle form submission
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/project/projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  // Update handleSubmit to send samples to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      // console.log("Project ID:", projectId);
     

      // Send each sample to the backend
      const samplePromises = formData.samples.map((sample) => {
        return axios.post(
          `${
            import.meta.env.VITE_API_URL
          }/project/project/${projectId}/samples`,
          sample,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      });

      // Wait for all samples to be added
      await Promise.all(samplePromises);

      alert("Samples added successfully!");
    } catch (error) {
      console.error("Error adding samples:", error);
      alert("Failed to add samples. Please try again.");
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
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section Gestion des échantillons */}
                <div className="border-t pt-6">
                  <h2 className="text-lg font-semibold text-teal-700 mb-4">
                    <FaFlask className="inline mr-2" /> Gestion des échantillons
                  </h2>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Identification*
                        </label>
                        <input
                          type="text"
                          name="identification"
                          value={formData.currentSample.identification}
                          onChange={handleSampleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="ID unique de l'échantillon"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type d'échantillon*
                        </label>
                        <input
                          type="text"
                          name="type"
                          value={formData.currentSample.type}
                          onChange={handleSampleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Ex: Sang, Tissu, ADN..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantité*
                        </label>
                        <input
                          type="text"
                          name="quantity"
                          value={formData.currentSample.quantity}
                          onChange={handleSampleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Ex: 5ml, 10g..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Technicien responsable
                        </label>
                        <select
                          name="technician"
                          value={formData.currentSample.technician}
                          onChange={handleSampleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="">Sélectionner un technicien</option>
                          {availableTeamMembers
                            .filter((member) =>
                              member.role.includes("Technicien")
                            )
                            .map((tech) => (
                              <option key={tech.id} value={tech.name}>
                                {tech.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date de collecte
                        </label>
                        <input
                          type="date"
                          name="collectionDate"
                          value={formData.currentSample.collectionDate}
                          onChange={handleSampleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date d'expiration
                        </label>
                        <input
                          type="date"
                          name="expirationDate"
                          value={formData.currentSample.expirationDate}
                          onChange={handleSampleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Protocole spécifique à l'échantillon
                        </label>
                        <div className="flex items-center">
                          <input
                            type="file"
                            name="protocolFile"
                            onChange={handleSampleChange}
                            className="hidden"
                            id="protocolFileInput"
                          />
                          <label
                            htmlFor="protocolFileInput"
                            className="cursor-pointer flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                          >
                            <FaUpload className="mr-2" />
                            {protocolFile
                              ? protocolFile.name
                              : "Choisir un fichier"}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Conditions de stockage
                        </label>
                        <div className="flex gap-2 mb-2">
                          <select className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                            <option value="">Sélectionner une condition</option>
                            {storageConditions.map((condition, idx) => (
                              <option key={idx} value={condition}>
                                {condition}
                              </option>
                            ))}
                          </select>
                        </div>
                        {formData.currentSample.storageConditions.length >
                          0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.currentSample.storageConditions.map(
                              (condition, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800"
                                >
                                  {condition}
                                  <button
                                    type="button"
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                    onClick={() =>
                                      handleRemoveStorageCondition(condition)
                                    }
                                  >
                                    ×
                                  </button>
                                </span>
                              )
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lieu de stockage
                        </label>
                        <div className="flex gap-2 mb-2">
                          <select className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                            <option value="">Sélectionner un lieu</option>
                            {storageLocations.map((location, idx) => (
                              <option key={idx} value={location}>
                                {location}
                              </option>
                            ))}
                          </select>
                        </div>
                        {formData.currentSample.storageLocation.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.currentSample.storageLocation.map(
                              (location, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-purple-100 text-purple-800"
                                >
                                  {location}
                                  <button
                                    type="button"
                                    className="ml-1 text-purple-600 hover:text-purple-800"
                                    onClick={() =>
                                      handleRemoveStorageLocation(location)
                                    }
                                  >
                                    ×
                                  </button>
                                </span>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddSample}
                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 flex items-center"
                      >
                        <FaVial className="mr-2" /> Ajouter l'échantillon
                      </button>
                    </div>
                  </div>

                  {/* Liste des échantillons ajoutés */}
                  {formData.samples.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-md font-medium text-gray-800 mb-3">
                        Échantillons associés au projet (
                        {formData.samples.length})
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="py-2 px-3 border-b text-left">
                                ID
                              </th>
                              <th className="py-2 px-3 border-b text-left">
                                Type
                              </th>
                              <th className="py-2 px-3 border-b text-left">
                                Quantité
                              </th>
                              <th className="py-2 px-3 border-b text-left">
                                Technicien
                              </th>
                              <th className="py-2 px-3 border-b text-left">
                                Conditions
                              </th>
                              <th className="py-2 px-3 border-b text-left">
                                Statut
                              </th>
                              <th className="py-2 px-3 border-b text-center w-20">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.samples.map((sample) => (
                              <tr key={sample.id} className="hover:bg-gray-50">
                                <td className="py-2 px-3 border-b font-medium">
                                  {sample.identification}
                                </td>
                                <td className="py-2 px-3 border-b">
                                  {sample.type}
                                </td>
                                <td className="py-2 px-3 border-b">
                                  {sample.quantity}
                                </td>
                                <td className="py-2 px-3 border-b">
                                  {sample.technician || "-"}
                                </td>
                                <td className="py-2 px-3 border-b">
                                  {sample.storageConditions.join(", ") || "-"}
                                </td>
                                <td className="py-2 px-3 border-b">
                                  <span
                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                      sample.status === "Available"
                                        ? "bg-green-100 text-green-800"
                                        : sample.status === "In Use"
                                        ? "bg-blue-100 text-blue-800"
                                        : sample.status === "Depleted"
                                        ? "bg-red-100 text-red-800"
                                        : sample.status === "Compromised"
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-purple-100 text-purple-800"
                                    }`}
                                  >
                                    {sample.status}
                                  </span>
                                </td>
                                <td className="py-2 px-3 border-b text-center">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveSample(sample.id)
                                    }
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    Retirer
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Boutons de soumission */}
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                  >
                    add sampeles to project
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

export default AddSample;

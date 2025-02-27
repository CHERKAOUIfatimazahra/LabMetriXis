import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../../components/Header";
import Sidebar from "../../../../components/Sidebar";
import {
  FaChartLine,
  FaClipboardList,
  FaUsers,
  FaFileAlt,
  FaFlask,
  FaUpload,
  FaVial,
} from "react-icons/fa";
import axios from "axios";

function AddSample() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("projects");
  const [protocolFile, setProtocolFile] = useState(null);
  const [availableTeamMembers, setAvailableTeamMembers] = useState([]);
  const [storageConditions, setStorageConditions] = useState([
    "Room Temperature",
    "Refrigerated (2-8°C)",
    "Frozen (-20°C)",
    "Ultra-frozen (-80°C)",
    "Liquid Nitrogen",
  ]);
  const [sampleTypes, setSampleTypes] = useState([
    "Blood",
    "Tissue",
    "DNA",
    "RNA",
    "Protein",
    "Cell Culture",
    "Serum",
    "Plasma",
    "Other",
  ]);
  const [units, setUnits] = useState([
    "ml",
    "µl",
    "g",
    "mg",
    "µg",
    "cells",
    "pieces",
  ]);

  // Initial form data state
  const [formData, setFormData] = useState({
    samples: [],

    // New samples properties aligned with schema
    currentSample: {
      name: "",
      description: "",
      type: "",
      quantity: "",
      unit: "",
      storageConditions: "",
      collectionDate: "",
      expirationDate: "",
      protocolFile: null,
      technicianResponsible: "",
      status: "Pending",
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
      !formData.currentSample.name ||
      !formData.currentSample.description ||
      !formData.currentSample.type ||
      !formData.currentSample.quantity ||
      !formData.currentSample.unit ||
      !formData.currentSample.collectionDate ||
      !formData.currentSample.technicianResponsible
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
        name: "",
        description: "",
        type: "",
        quantity: "",
        unit: "",
        storageConditions: "",
        collectionDate: "",
        expirationDate: "",
        protocolFile: null,
        technicianResponsible: "",
        status: "Pending",
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

  // Fetch project data and team members
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

    const fetchTeamMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAvailableTeamMembers(response.data || []);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };

    if (projectId) {
      fetchProject();
      fetchTeamMembers();
    }
  }, [projectId]);

  // get user id of the technicianResponsible from database
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/project/available-technicians`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setAvailableTeamMembers(response.data || []);
      } catch (error) {
        console.error("Error fetching team members:", error);
      }
    };
    fetchTeamMembers();
  }, []);

  // Update handleSubmit to send samples to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.samples.length === 0) {
      alert("Veuillez ajouter au moins un échantillon");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const samplePromises = formData.samples.map(async (sample) => {
        // Create a regular JSON object instead of FormData
        const sampleData = {
          name: sample.name,
          description: sample.description,
          type: sample.type,
          quantity: sample.quantity,
          unit: sample.unit,
          storageConditions: sample.storageConditions,
          collectionDate: sample.collectionDate,
          technicianResponsible: sample.technicianResponsible,
          status: sample.status,
          identification: `${sample.type}-${Date.now()}`,
        };

        // Add optional fields only if they exist
        if (sample.expirationDate) {
          sampleData.expirationDate = sample.expirationDate;
        }

        // If you need to handle file uploads, you'll still need FormData
        if (sample.protocolFile) {
          // Create FormData for file upload
          const fileData = new FormData();
          fileData.append("protocolFile", sample.protocolFile);
          fileData.append("sampleData", JSON.stringify(sampleData));

          return axios.post(
            `${
              import.meta.env.VITE_API_URL
            }/project/projects/${projectId}/samples`,
            fileData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }
      });

      await Promise.all(samplePromises);
      console.log("Samples added successfully!");
      navigate(`/dashboard/researcher/projects`);
    } catch (error) {
      console.error("Error adding samples:", error);
      alert("Échec lors de l'ajout des échantillons. Veuillez réessayer.");
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
                  Ajouter des échantillons au projet
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
                          Nom de l'échantillon*
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.currentSample.name}
                          onChange={handleSampleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Nom unique de l'échantillon"
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description*
                        </label>
                        <input
                          type="text"
                          name="description"
                          value={formData.currentSample.description}
                          onChange={handleSampleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Description courte de l'échantillon"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type d'échantillon*
                        </label>
                        <select
                          name="type"
                          value={formData.currentSample.type}
                          onChange={handleSampleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="">Sélectionner un type</option>
                          {sampleTypes.map((type, idx) => (
                            <option key={idx} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantité*
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          value={formData.currentSample.quantity}
                          onChange={handleSampleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          placeholder="Ex: 5, 10, 25..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Unité*
                        </label>
                        <select
                          name="unit"
                          value={formData.currentSample.unit}
                          onChange={handleSampleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="">Sélectionner une unité</option>
                          {units.map((unit, idx) => (
                            <option key={idx} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Technicien responsable*
                        </label>
                        <select
                          name="technicianResponsible"
                          value={formData.currentSample.technicianResponsible}
                          onChange={handleSampleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="">Sélectionner un technicien</option>
                          {availableTeamMembers.map((tech) => (
                            <option key={tech._id} value={tech._id}>
                              {tech.firstName && tech.lastName
                                ? `${tech.firstName} ${tech.lastName}`
                                : tech.name || tech.email}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date de collecte*
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
                          Conditions de stockage
                        </label>
                        <select
                          name="storageConditions"
                          value={formData.currentSample.storageConditions}
                          onChange={handleSampleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="">Sélectionner une condition</option>
                          {storageConditions.map((condition, idx) => (
                            <option key={idx} value={condition}>
                              {condition}
                            </option>
                          ))}
                        </select>
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

                    <div className="flex justify-end mt-4">
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
                                Nom
                              </th>
                              <th className="py-2 px-3 border-b text-left">
                                Type
                              </th>
                              <th className="py-2 px-3 border-b text-left">
                                Quantité
                              </th>
                              <th className="py-2 px-3 border-b text-left">
                                Date de collecte
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
                                  {sample.name}
                                </td>
                                <td className="py-2 px-3 border-b">
                                  {sample.type}
                                </td>
                                <td className="py-2 px-3 border-b">
                                  {sample.quantity} {sample.unit}
                                </td>
                                <td className="py-2 px-3 border-b">
                                  {new Date(
                                    sample.collectionDate
                                  ).toLocaleDateString()}
                                </td>
                                <td className="py-2 px-3 border-b">
                                  {sample.storageConditions || "-"}
                                </td>
                                <td className="py-2 px-3 border-b">
                                  <span
                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                      sample.status === "Pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : sample.status === "In Analysis"
                                        ? "bg-blue-100 text-blue-800"
                                        : sample.status === "Analyzed"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
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
                    type="button"
                    onClick={() =>
                      navigate(`/dashboard/researcher/projects/${projectId}`)
                    }
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                  >
                    Ajouter les échantillons au projet
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

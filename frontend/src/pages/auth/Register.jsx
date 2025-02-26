import React, { useState } from "react";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiBookmark,
  FiBriefcase,
  FiActivity,
  FiHash,
} from "react-icons/fi";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "chercheur",
    institution: "",
    specialty: "",
    agreeTerms: false,
    profileImage: null,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Le nom est requis";

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Le numéro de téléphone est requis";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Format de numéro de téléphone invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    if (!formData.institution.trim())
      newErrors.institution = "L'institution est requise";

    if (!formData.agreeTerms)
      newErrors.agreeTerms = "Vous devez accepter les conditions d'utilisation";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Simulation d'une requête API
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          ...formData,
        }
      );

      console.log(response.data);
      setIsSubmitting(false);
      setSuccessMessage("Inscription réussie. Veuillez vérifier votre email.");
    } catch (error) {
      setIsSubmitting(false);
      // Gestion améliorée des erreurs
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({
          submit:
            "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        });
      }
      console.error("Erreur d'inscription:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full px-4 bg-gradient-to-r from-teal-50 to-blue-50 relative overflow-hidden p-8">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 z-0">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-teal-500"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-blue-500"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-teal-300"></div>
      </div>

      {/* Main container */}
      <div className="w-full max-w-4xl z-10 flex rounded-xl shadow-2xl bg-white overflow-hidden">
        {/* Left side - Branding */}
        <div className="hidden md:flex md:w-1/3 bg-gradient-to-b from-teal-500 to-teal-700 p-8 flex-col justify-between">
          <div>
            <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mb-6">
              <FiActivity className="h-8 w-8 text-teal-600" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">LabMetriXis</h2>
            <p className="text-teal-100 mb-6">
              Système avancé de gestion de laboratoire pour professionnels
            </p>
          </div>
          <div className="text-teal-100 text-sm">
            © {new Date().getFullYear()} LabMetriXis. Tous droits réservés.
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-2/3 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-medium text-gray-800">
              Créer un compte
            </h3>
            <div className="md:hidden flex items-center">
              <FiActivity className="h-6 w-6 text-teal-600 mr-2" />
              <span className="text-lg font-bold text-teal-700">
                LabMetriXis
              </span>
            </div>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
              <p className="text-green-800">{successMessage}</p>
            </div>
          )}

          {/* Error message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-red-600">{errorMessage}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name & Phone */}
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nom complet
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-4 w-4 text-teal-500" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className={`block w-full pl-10 py-2 text-sm border rounded-md shadow-sm ${
                      errors.name
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                    }`}
                    placeholder="Marie Curie"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Téléphone
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-4 w-4 text-teal-500" />
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    className={`block w-full pl-10 py-2 text-sm border rounded-md shadow-sm ${
                      errors.phoneNumber
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                    }`}
                    placeholder="+33612345678"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Adresse email professionnelle
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-4 w-4 text-teal-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={`block w-full pl-10 py-2 text-sm border rounded-md shadow-sm ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                  }`}
                  placeholder="marie.curie@labmetrixis.fr"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Institution & Role */}
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="institution"
                  className="block text-sm font-medium text-gray-700"
                >
                  Institution
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiBriefcase className="h-4 w-4 text-teal-500" />
                  </div>
                  <input
                    type="text"
                    name="institution"
                    id="institution"
                    className={`block w-full pl-10 py-2 text-sm border rounded-md shadow-sm ${
                      errors.institution
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                    }`}
                    placeholder="Université Paris-Saclay"
                    value={formData.institution}
                    onChange={handleChange}
                  />
                  {errors.institution && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.institution}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rôle
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiBookmark className="h-4 w-4 text-teal-500" />
                  </div>
                  <select
                    id="role"
                    name="role"
                    className="block w-full pl-10 py-2 text-sm border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="chercheur">Chercheur</option>
                    <option value="technicien">Technicien</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Specialty & Initials */}
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="specialty"
                  className="block text-sm font-medium text-gray-700"
                >
                  Spécialité
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiBookmark className="h-4 w-4 text-teal-500" />
                  </div>
                  <input
                    type="text"
                    name="specialty"
                    id="specialty"
                    className="block w-full pl-10 py-2 text-sm border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400"
                    placeholder="Biochimie"
                    value={formData.specialty}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mot de passe
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-4 w-4 text-teal-500" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className={`block w-full pl-10 py-2 text-sm border rounded-md shadow-sm ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                    }`}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmer
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-4 w-4 text-teal-500" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className={`block w-full pl-10 py-2 text-sm border rounded-md shadow-sm ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                    }`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  className={`h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded ${
                    errors.agreeTerms ? "border-red-500" : ""
                  }`}
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
              </div>
              <div className="ml-2 text-sm">
                <label htmlFor="agreeTerms" className="text-gray-700">
                  J'accepte les{" "}
                  <a href="#" className="text-teal-600 hover:text-teal-500">
                    conditions d'utilisation
                  </a>{" "}
                  et la{" "}
                  <a href="#" className="text-teal-600 hover:text-teal-500">
                    politique de confidentialité
                  </a>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.agreeTerms}
                  </p>
                )}
              </div>
            </div>

            {/* Error message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit button */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-3 sm:space-y-0 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-1/2 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Traitement...
                  </span>
                ) : (
                  "Créer un compte"
                )}
              </button>
              <a
                href="/login"
                className="w-full sm:w-1/2 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Se connecter
              </a>
            </div>
          </form>

          <div className="mt-4 text-center text-xs text-gray-500 md:hidden">
            © {new Date().getFullYear()} LabMetriXis. Tous droits réservés.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

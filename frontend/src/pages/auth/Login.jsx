import React, { useState } from "react";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
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

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    }

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
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        formData
      );
      const { token, user } = response.data;

      localStorage.setItem("token", token);

      // Redirect based on user role
      switch (user.role) {
        case "admin":
          window.location.href = "/admin/dashboard";
          break;
        case "chercheur":
          window.location.href = "/dashboard/researcher";
          break;
        case "technicien":
          window.location.href = "/dashboard/technician";
          break;
        default:
          setErrors({ submit: "Rôle d'utilisateur non reconnu." });
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response?.status === 401) {
        setErrors({ submit: "Email ou mot de passe incorrect" });
      } else {
        setErrors({ submit: "Une erreur s'est produite. Veuillez réessayer." });
      }
    }
  };

  return (
    <div
      className="h-screen w-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage:
          'url("https://btsoft.com/wp-content/uploads/2023/12/20231212_BTS_ModernLaboratory_SupportImage-1080x600.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="flex flex-col items-center max-w-md w-full px-4 relative pb-8">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-white">LabMetriXis</h2>
          <p className="mt-2 text-sm text-white font-medium">
            Système de Gestion de Laboratoire
          </p>
        </div>

        <div className="bg-white w-full py-8 px-6 shadow-2xl rounded-xl border border-gray-50">
          <div className="text-center mb-6">
            <h3 className="text-xl font-medium text-gray-900">Connexion</h3>
            <p className="mt-1 text-sm text-gray-500">
              Accédez à votre espace de travail
            </p>
          </div>

          <form className="space-y-5 m-3" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Adresse email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-teal-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={`block w-full pl-10 sm:text-sm rounded-lg py-2.5 border ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                  }`}
                  placeholder="marie.curie@labmetrixis.fr"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-teal-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className={`block w-full pl-10 sm:text-sm rounded-lg py-2.5 border ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-teal-600 hover:text-teal-500 transition-colors"
                >
                  Mot de passe oublié?
                </a>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-all duration-150"
              >
                {isSubmitting ? (
                  "Connexion en cours..."
                ) : (
                  <>
                    Se connecter
                    <FiArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Pas encore de compte?
                </span>
              </div>
            </div>

            <div className="mt-5">
              <a
                href="/register"
                className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
              >
                Créer un compte
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-white">
          © {new Date().getFullYear()} LabMetriXis. Tous droits réservés.
        </div>
      </div>
    </div>
  );
}

export default Login;

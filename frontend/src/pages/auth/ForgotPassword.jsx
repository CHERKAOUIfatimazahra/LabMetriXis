import React, { useState } from "react";
import { FiMail, FiAlertCircle } from "react-icons/fi";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format d'email invalide";
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
      // Simulation d'une requête API
      console.log("Email pour réinitialisation:", email);

      // Ici, vous implémenteriez votre appel API
      // const response = await axios.post('/api/reset-password', { email });

      // Simulation de délai
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1500);
    } catch (error) {
      setIsSubmitting(false);
      setErrors({
        submit: "Erreur lors de l'envoi. Veuillez réessayer.",
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          'url("https://btsoft.com/wp-content/uploads/2023/12/20231212_BTS_ModernLaboratory_SupportImage-1080x600.png")',
      }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4">
        <div className="flex justify-center"></div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          LabMetriXis
        </h2>
        <p className="mt-2 text-center text-sm text-teal-700">
          Système de Gestion de Laboratoire
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-6">
                <h3 className="text-xl font-medium text-gray-900">
                  Mot de passe oublié
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Saisissez votre adresse e-mail pour recevoir les instructions
                  de réinitialisation
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
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
                      className={`block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border ${
                        errors.email
                          ? "border-red-500"
                          : "focus:ring-teal-500 focus:border-teal-500"
                      }`}
                      placeholder="marie.curie@labmetrixis.fr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Envoi en cours..."
                      : "Réinitialiser le mot de passe"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center">
                  <FiMail className="h-8 w-8 text-teal-600" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Vérifiez votre boîte de réception
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Si un compte existe avec l'adresse <strong>{email}</strong>,
                vous recevrez un email avec les instructions pour réinitialiser
                votre mot de passe.
              </p>
              <p className="text-xs text-gray-400 mb-2">
                N'avez-vous pas reçu l'email? Vérifiez votre dossier spam.
              </p>
            </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Vous vous souvenez de votre mot de passe?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Retour à la connexion
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} LabMetriXis. Tous droits réservés.
      </div>
    </div>
  );
}

export default ForgotPassword;

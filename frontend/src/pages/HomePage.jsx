import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BeakerIcon,
  UsersIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CogIcon,
  ChevronDownIcon,
  PlayCircleIcon,
  XIcon,
} from "lucide-react";

const HomePage = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const features = [
    {
      icon: <BeakerIcon className="w-6 h-6" />,
      title: "Sample Management",
      description:
        "Track and manage laboratory samples with detailed metadata and real-time status updates",
      details:
        "Our advanced sample management system includes barcode scanning, storage location tracking, and automated alerts for sample expiration.",
    },
    {
      icon: <UsersIcon className="w-6 h-6" />,
      title: "Project Tracking",
      description:
        "Create and monitor research projects, manage resources, and track scientific protocols",
      details:
        "Comprehensive project management tools with Gantt charts, milestone tracking, and automated reporting capabilities.",
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description:
        "Comprehensive analytics and reporting tools for data-driven decision making",
      details:
        "Interactive data visualization tools, custom report generation, and real-time analytics dashboards.",
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: "Secure Platform",
      description:
        "Advanced security measures with JWT authentication and role-based permissions",
      details:
        "Enterprise-grade security with encryption, audit trails, and compliance with industry standards.",
    },
    {
      icon: <CogIcon className="w-6 h-6" />,
      title: "Equipment Management",
      description:
        "Monitor and maintain laboratory equipment with detailed tracking",
      details:
        "Comprehensive equipment lifecycle management including maintenance schedules, calibration records, and usage tracking.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Video Background Hero Section */}
      <div className="relative h-screen">
        {/* Video Background with Fallback */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />

          {/* Video element */}
          <video
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`w-full h-full object-cover transform scale-105 ${
              isVideoLoaded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-1000`}
          >
            {/* Replace these source files with your actual video files */}
            <source src="https://youtu.be/j_euW8XHBZU" type="video/webm" />
            <source src="https://youtu.be/j_euW8XHBZU" type="video/mp4" />
            {/* Fallback image if video fails to load */}
            <img
              src="https://www.shutterstock.com/image-photo/modern-medical-research-laboratory-two-260nw-1884612574.jpg"
              alt="Lab background"
              className="w-full h-full object-cover"
            />
          </video>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 animate-fade-in-up">
              Welcome to LabMetriXis
            </h1>
            <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto animate-fade-in-up delay-200">
              Advanced Laboratory Management System for modern research
              facilities. Streamline your workflows, enhance collaboration, and
              accelerate scientific discoveries.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-300">
              <Link
                to="/register"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 transform hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white bg-opacity-20 backdrop-blur-lg text-white rounded-lg hover:bg-opacity-30 transition-all transform hover:scale-105"
              >
                Sign In
              </Link>
            </div>
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ChevronDownIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onMouseEnter={() => setActiveFeature(index)}
                onMouseLeave={() => setActiveFeature(null)}
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {activeFeature === index
                      ? feature.details
                      : feature.description}
                  </p>
                </div>
                <div
                  className={`bg-blue-50 p-4 transform transition-all duration-300 ${
                    activeFeature === index
                      ? "translate-y-0"
                      : "translate-y-full"
                  }`}
                >
                  <Link
                    to="/learn-more"
                    className="text-blue-600 font-medium hover:text-blue-700"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

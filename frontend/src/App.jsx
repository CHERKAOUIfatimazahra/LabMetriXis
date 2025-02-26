import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmailNotice from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
// import  ResetPassword  from "./pages/auth/ResetPassword";

import ResearcherDashboard from "./pages/dashboard/researcher/ResearcherDashboard";
import ProjectDetailsPage from "./pages/dashboard/researcher/ProjectDetailsPage";
import ProjectListPage from "./pages/dashboard/researcher/ProjectListPage";

// create project page
import ProjectCreatePage from "./pages/dashboard/researcher/createProject/ProjectCreatePage";
import AddSample from "./pages/dashboard/researcher/createProject/AddSample";

// edit project page
import ProjectEditPage from "./pages/dashboard/researcher/ProjectEditPage";
import PublicationsPage from "./pages/dashboard/researcher/PublicationsPage";
import ResearcherProfilePage from "./pages/dashboard/researcher/ResearcherProfilePage";
import TeamMembersPage from "./pages/dashboard/researcher/TeamMembersPage";
import PublicationsCreatePage from "./pages/dashboard/researcher/PublicationsCreatePage";

import PublishedProjectsListPage from "./pages/dashboard/researcher/PublishedProjectsListPage";
import PublishedProjectDetailsPage from "./pages/dashboard/researcher/PublishedProjectDetailsPage";

import TechnicianDashboard from "./pages/dashboard/technician/TechnicianDashboard";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";

import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email-notice" element={<VerifyEmailNotice />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        {/* researcher pages */}
        <Route path="/dashboard/researcher" element={<ResearcherDashboard />} />
        <Route
          path="/dashboard/researcher/projects"
          element={<ProjectListPage />}
        />
        <Route
          path="/dashboard/researcher/projects/create"
          element={<ProjectCreatePage />}
        />
        <Route
          path="/dashboard/researcher/projects/create/add-sample/:id"
          element={<AddSample />}
        />
        <Route
          path="/dashboard/researcher/projects/:id"
          element={<ProjectDetailsPage />}
        />
        <Route
          path="/dashboard/researcher/projects/:id/edit"
          element={<ProjectEditPage />}
        />
        <Route
          path="/dashboard/researcher/publications"
          element={<PublicationsPage />}
        />
        <Route
          path="/dashboard/researcher/profile"
          element={<ResearcherProfilePage />}
        />
        <Route
          path="/dashboard/researcher/team"
          element={<TeamMembersPage />}
        />
        <Route
          path="/dashboard/researcher/publications/create"
          element={<PublicationsCreatePage />}
        />
        <Route
          path="/dashboard/researcher/projects/published"
          element={<PublishedProjectsListPage />}
        />
        <Route
          path="/dashboard/researcher/projects/published/:id"
          element={<PublishedProjectDetailsPage />}
        />

        {/* technician pages */}
        <Route path="/dashboard/technician" element={<TechnicianDashboard />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

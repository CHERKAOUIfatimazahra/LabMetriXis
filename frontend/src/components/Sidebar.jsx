import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  activeTab,
  setActiveTab,
  navItems,
  quickStats,
  accentColor = "blue",
  statsTitle = "QUICK STATS",
}) => {
  const navigate = useNavigate();

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    navigate(item.navigator);
  };

  return (
    <aside className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-md transition ${
                  activeTab === item.id
                    ? `bg-${accentColor}-100 text-${accentColor}-800`
                    : "hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Stats */}
      {quickStats && quickStats.length > 0 && (
        <div className="mt-8 border-t pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            {statsTitle}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {quickStats.map((stat) => (
              <div
                key={stat.id}
                className={`bg-${stat.color}-50 p-3 rounded-md`}
              >
                <p className={`text-xs text-${stat.color}-600`}>{stat.label}</p>
                <p className={`text-lg font-bold text-${stat.color}-800`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

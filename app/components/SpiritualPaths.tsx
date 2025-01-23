import React from "react";
import { Icons } from "./Icons";
import { spiritualPaths } from "../../utils/spiritualPaths";

const SpiritualPaths = ({
  navigateToGame,
}: {
  navigateToGame: (id: string) => void;
}) => {
  const renderIcon = (
    icon: string | (() => React.ReactNode)
  ): React.ReactNode => {
    if (typeof icon === "function") {
      return icon();
    }
    return icon;
  };

  return (
    <div className="mt-12 bg-gradient-to-br from-orange-50 to-pink-50 p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 mb-8 text-center">
        Chemins Spirituels
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {spiritualPaths.map((path) => (
          <div
            key={path.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-[600px]"
          >
            <div
              className={`p-6 bg-gradient-to-br ${path.color} text-white flex-shrink-0`}
            >
              <div className="flex items-center justify-center mb-4 h-16">
                <div className="w-12 h-12">{renderIcon(path.icon)}</div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2 h-8 flex items-center justify-center">
                {path.title}
              </h3>
              <p className="text-sm opacity-90 text-center h-20 overflow-hidden">
                {path.description}
              </p>
            </div>

            <div className="p-6 bg-white flex flex-col h-full justify-between">
              <ul className="space-y-2 mb-6">
                {path.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex items-start text-gray-700 py-2"
                  >
                    <span className="mr-2 text-orange-500 font-bold">•</span>
                    <span className="text-sm">{detail}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <button
                  onClick={() => navigateToGame(path.id)}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-6 rounded-lg hover:from-orange-600 hover:to-pink-600 transform hover:-translate-y-0.5 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                >
                  Commencer le Voyage
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpiritualPaths;

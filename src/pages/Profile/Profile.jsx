import React, { use } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";

export const Profile = () => {
  const { user } = use(AuthContext);

  // User details safely extract kora
  const profilePic = user?.photoURL || "https://via.placeholder.com/150";
  const userName = user?.displayName || "User Name";
  const userEmail = user?.email || "No email provided";
  const lastLogin = user?.metadata?.lastSignInTime || "N/A";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* Profile Card Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header/Cover Section */}
        <div className="h-48 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        {/* Content Section */}
        <div className="relative px-6 pb-10">
          {/* Profile Image & Name Section */}
          <div className="flex flex-col items-center -mt-20">
            <img
              src={profilePic}
              alt="Profile"
              className="w-40 h-40 rounded-full border-8 border-white shadow-lg object-cover bg-white"
            />
            <h2 className="mt-4 text-3xl font-bold text-gray-800">
              {userName}
            </h2>
            <p className="text-gray-500 font-medium">{userEmail}</p>

            <div className="mt-6 flex gap-3">
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition shadow-md">
                Edit Profile
              </button>
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition">
                Settings
              </button>
            </div>
          </div>

          <hr className="my-10 border-gray-100" />

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 md:px-10">
            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700 border-l-4 border-indigo-500 pl-3">
                Account Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                  Email Status
                </p>
                <p className="text-gray-700">
                  {user?.emailVerified ? (
                    <span className="text-green-600 flex items-center gap-1 font-medium">
                      ● Verified
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-1 font-medium">
                      ● Not Verified
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Activity Logs */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-700 border-l-4 border-pink-500 pl-3">
                Activity & Security
              </h3>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                  Last Sign In
                </p>
                <p className="text-gray-700">{lastLogin}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

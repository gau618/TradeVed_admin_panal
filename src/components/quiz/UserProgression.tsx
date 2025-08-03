'use client';
import { useState } from "react";

interface UserProgression {
  userId: string;
  xp: number;
  level: number;
  eloRating: number;
  experienceLevel: string;
  levelInfo: {
    xpForCurrentLevel: number;
    xpForNextLevel: number;
    xpToNext: number;
    progress: number;
    xpInCurrentLevel: number;
    xpNeededForCurrentLevel: number;
  };
}

export default function UserProgression() {
  const [userId, setUserId] = useState("");
  const [userProgression, setUserProgression] = useState<UserProgression | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchUserProgression = async () => {
    if (!userId.trim()) {
      setMessage({ type: "error", text: "Please enter a user ID" });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
     
      const response = await fetch(`http://94.136.190.104:3000/api/admin/users/${userId}/progression`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found");
        }
        throw new Error("Failed to fetch user progression");
      }

      const data = await response.json();
      setUserProgression(data.data);
      setMessage({ type: "success", text: "User progression loaded successfully" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
      setUserProgression(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProgression = async () => {
    if (!userProgression) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`http://94.136.190.104:3000/api/admin/users/${userId}/progression`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          xp: userProgression.xp,
          level: userProgression.level,
          eloRating: userProgression.eloRating,
          experienceLevel: userProgression.experienceLevel,
        }),
      });

      if (!response.ok) throw new Error("Failed to update user progression");

      const data = await response.json();
      setUserProgression(data.data);
      setMessage({ type: "success", text: "User progression updated successfully" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update user progression" });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (!userProgression) return;
    setUserProgression((prev) => ({ ...prev!, [field]: value }));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">User Progression Management</h2>
        <p className="text-sm text-gray-600">Search and manage user progression data</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search User</h3>
        <div className="flex gap-3">
          <input
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          <button
            onClick={fetchUserProgression}
            disabled={loading}
            className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            ) : (
              <span className="mr-2">🔍</span>
            )}
            Search
          </button>
        </div>
      </div>

      {/* Alert Message */}
      {message && (
        <div className={`p-4 mb-6 rounded-lg border ${
          message.type === "error" 
            ? "bg-red-50 border-red-200 text-red-700" 
            : "bg-green-50 border-green-200 text-green-700"
        }`}>
          <div className="flex items-center">
            <span className="mr-2">{message.type === "error" ? "⚠️" : "✅"}</span>
            {message.text}
          </div>
        </div>
      )}

      {/* User Progression Display */}
      {userProgression && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Progression</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">Level</div>
                <div className="text-2xl font-bold text-blue-600">{userProgression.level}</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">Total XP</div>
                <div className="text-2xl font-bold text-green-600">{userProgression.xp.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">ELO Rating</div>
                <div className="text-2xl font-bold text-purple-600">{userProgression.eloRating}</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">Experience</div>
                <div className="text-lg font-semibold text-gray-900 capitalize">
                  {userProgression.experienceLevel.toLowerCase()}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to Level {userProgression.level + 1}</span>
                <span>{userProgression.levelInfo.xpToNext} XP needed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${userProgression.levelInfo.progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {userProgression.levelInfo.xpInCurrentLevel} / {userProgression.levelInfo.xpNeededForCurrentLevel} XP
              </div>
            </div>
          </div>

          {/* Edit Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Progression</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Points (XP)
                </label>
                <input
                  type="number"
                  min="0"
                  value={userProgression.xp}
                  onChange={(e) => handleInputChange("xp", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <input
                  type="number"
                  min="1"
                  value={userProgression.level}
                  onChange={(e) => handleInputChange("level", parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ELO Rating</label>
                <input
                  type="number"
                  min="0"
                  value={userProgression.eloRating}
                  onChange={(e) => handleInputChange("eloRating", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  value={userProgression.experienceLevel}
                  onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <button
                onClick={updateUserProgression}
                disabled={saving}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
              >
                {saving ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">💾</span>
                    Update Progression
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

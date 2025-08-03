'use client';
import { useState } from "react";

interface LevelInfo {
  level: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpToNext: number;
  progress: number;
  xpInCurrentLevel: number;
  xpNeededForCurrentLevel: number;
}

export default function LevelCalculator() {
  const [xp, setXp] = useState<number>(0);
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateLevel = async () => {
    if (xp < 0) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch("http://94.136.190.104:3000/api/admin/level-system/calculate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ xp }),
      });

      if (!response.ok) throw new Error("Failed to calculate level");

      const data = await response.json();
      setLevelInfo(data.data);
    } catch (error) {
      console.error("Failed to calculate level:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Level Calculator</h2>
        <p className="text-sm text-gray-600">Calculate user level based on experience points</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Calculate Level from XP
        </h3>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Points
            </label>
            <input
              type="number"
              min="0"
              value={xp}
              onChange={(e) => setXp(parseInt(e.target.value) || 0)}
              placeholder="Enter XP amount"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={calculateLevel}
              disabled={loading}
              className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              ) : (
                <span className="mr-2">🧮</span>
              )}
              Calculate
            </button>
          </div>
        </div>

        {levelInfo && (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Level Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">Current Level</div>
                <div className="text-3xl font-bold text-blue-600">{levelInfo.level}</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">Progress to Next Level</div>
                <div className="text-3xl font-bold text-green-600">{levelInfo.progress}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">XP in Current Level</div>
                <div className="text-lg font-semibold text-gray-900">
                  {levelInfo.xpInCurrentLevel.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-1">XP Needed for Next Level</div>
                <div className="text-lg font-semibold text-gray-900">
                  {levelInfo.xpToNext.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="text-sm font-medium text-gray-600 mb-2">Level Range</div>
              <div className="text-sm text-gray-700">
                Level {levelInfo.level}: {levelInfo.xpForCurrentLevel.toLocaleString()} - {(levelInfo.xpForNextLevel - 1).toLocaleString()} XP
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

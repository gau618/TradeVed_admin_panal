'use client';

import { useState, useEffect } from 'react';

interface GameModeConfig {
  id: string;
  gameMode: string;
  xpPerCorrect: number;
  eloEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function GameModeConfig() {
  const [configs, setConfigs] = useState<GameModeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const gameModeNames = {
    QUICK_DUEL: 'Quick Duel',
    FASTEST_FINGER_FIRST: 'Fastest Finger First',
    PRACTICE: 'Practice Mode',
    TIME_ATTACK: 'Time Attack',
    GROUP_PLAY: 'Group Play'
  };

  const fetchConfigs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://94.136.190.104:3000/api/admin/game-modes/config', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch configurations');
      
      const data = await response.json();
      setConfigs(data.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load configurations' });
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (gameMode: string, updates: Partial<GameModeConfig>) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://94.136.190.104:3000/api/admin/game-modes/${gameMode}/config`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update configuration');
      
      const data = await response.json();
      
      setConfigs(prev => prev.map(config => 
        config.gameMode === gameMode ? data.data : config
      ));
      
      setMessage({ type: 'success', text: `${gameModeNames[gameMode]} updated successfully` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update configuration' });
    } finally {
      setSaving(false);
    }
  };

  const bulkUpdate = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://94.136.190.104:3000/api/admin/game-modes/config/bulk', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ configurations: configs })
      });

      if (!response.ok) throw new Error('Failed to bulk update');
      
      setMessage({ type: 'success', text: 'All configurations updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to bulk update configurations' });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
     console.log(token);
      const response = await fetch('http://94.136.190.104:3000/api/admin/game-modes/config', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to reset configurations');
      
      const data = await response.json();
      setConfigs(data.data);
      setMessage({ type: 'success', text: 'Configurations reset to defaults' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reset configurations' });
    } finally {
      setSaving(false);
    }
  };

  const handleConfigChange = (gameMode: string, field: string, value: any) => {
    setConfigs(prev => prev.map(config => 
      config.gameMode === gameMode 
        ? { ...config, [field]: value }
        : config
    ));
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-gray-600">Loading configurations...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Game Mode Configuration</h2>
          <p className="text-sm text-gray-600">Configure XP rewards and ELO settings for each game mode</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={bulkUpdate} 
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            ) : (
              <span className="mr-2">💾</span>
            )}
            Save All
          </button>
          <button 
            onClick={resetToDefaults} 
            disabled={saving}
            className="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
          >
            <span className="mr-2">↻</span>
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Alert Message */}
      {message && (
        <div className={`p-4 mb-6 rounded-lg border ${
          message.type === 'error' 
            ? 'bg-red-50 border-red-200 text-red-700' 
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">{message.type === 'error' ? '⚠️' : '✅'}</span>
            {message.text}
          </div>
        </div>
      )}

      {/* Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configs.map((config) => (
          <div key={config.gameMode} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Card Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {gameModeNames[config.gameMode]}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                config.eloEnabled 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {config.eloEnabled ? 'Competitive' : 'Casual'}
              </span>
            </div>

            {/* Card Content */}
            <div className="space-y-4">
              {/* XP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  XP per Correct Answer
                </label>
                <input
                  type="number"
                  min="0"
                  value={config.xpPerCorrect}
                  onChange={(e) => handleConfigChange(
                    config.gameMode, 
                    'xpPerCorrect', 
                    parseInt(e.target.value) || 0
                  )}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>

              {/* ELO Switch */}
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={config.eloEnabled}
                  onChange={(e) => handleConfigChange(
                    config.gameMode, 
                    'eloEnabled', 
                    e.target.checked
                  )}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-3 flex items-center">
                  <span className="text-sm font-medium text-gray-700">ELO Rating Enabled</span>
                  <span className="ml-2 text-sm text-gray-500">
                    {config.eloEnabled ? '✅' : '❌'}
                  </span>
                </label>
              </div>

              {/* Update Button */}
              <button 
                onClick={() => updateConfig(config.gameMode, {
                  xpPerCorrect: config.xpPerCorrect,
                  eloEnabled: config.eloEnabled
                })}
                disabled={saving}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
              >
                {saving ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  'Update'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

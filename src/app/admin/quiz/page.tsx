'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import GameModeConfig from '@/components/quiz/GameModeConfig';
import UserProgression from '@/components/quiz/UserProgression';
import LevelCalculator from '@/components/quiz/LevelCalculator';

export default function QuizPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('game-modes');

  // Set active tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['game-modes', 'users', 'calculator'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const tabs = [
    { id: 'game-modes', label: 'Game Modes', icon: '⚙️' },
    { id: 'users', label: 'User Progression', icon: '👥' },
    { id: 'calculator', label: 'Level Calculator', icon: '🧮' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Management</h1>
        <p className="text-lg text-gray-600">Manage game configurations and user progression</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'game-modes' && <GameModeConfig />}
          {activeTab === 'users' && <UserProgression />}
          {activeTab === 'calculator' && <LevelCalculator />}
        </div>
      </div>
    </div>
  );
}

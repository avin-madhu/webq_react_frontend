import React from 'react';
import { TrendingUp } from 'lucide-react';

const PerformanceCard = ({ performance }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Performance Overview</h3>
        <TrendingUp className="h-5 w-5 text-blue-600" />
      </div>
      
      <div className={`rounded-lg p-4 mb-4 border ${getScoreBg(performance.performance_score)}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Overall Score</span>
          <span className={`text-2xl font-bold ${getScoreColor(performance.performance_score)}`}>
            {performance.performance_score}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-semibold text-blue-600">{performance.completed_courses?.length || 0}</div>
          <div className="text-sm text-gray-500">Completed Courses</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-semibold text-orange-600">{performance.pending_courses?.length || 0}</div>
          <div className="text-sm text-gray-500">Pending Courses</div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCard;
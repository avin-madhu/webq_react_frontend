import React from 'react';
import { CheckCircle, Clock, Play, BookOpen, Star } from 'lucide-react';

const RecommendationCard = ({ recommendation, onStatusUpdate }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'viewed':
        return <Play className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'viewed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'article':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const handleStatusChange = (newStatus) => {
    onStatusUpdate(recommendation.id, newStatus);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getTypeIcon(recommendation.resource.type)}
          <h4 className="font-medium text-gray-900">{recommendation.resource.title}</h4>
        </div>
        {getStatusIcon(recommendation.status)}
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        Difficulty: <span className="font-medium">{recommendation.resource.difficulty_level}</span>
      </p>
      
      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(recommendation.status)}`}>
          {recommendation.status.charAt(0).toUpperCase() + recommendation.status.slice(1)}
        </span>
        
        <div className="flex space-x-2">
          {recommendation.status === 'recommended' && (
            <button
              onClick={() => handleStatusChange('viewed')}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
            >
              Mark Viewed
            </button>
          )}
          {recommendation.status === 'viewed' && (
            <button
              onClick={() => handleStatusChange('completed')}
              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
            >
              Mark Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
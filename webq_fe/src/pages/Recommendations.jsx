import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Filter, 
  Search, 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Play,
  BookOpen,
  Video,
  FileText,
  Star,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/appContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Recommendations = () => {
  const { 
    currentStudent, 
    recommendations, 
    loading, 
    error, 
    generateRecommendations, 
    updateRecommendationStatus,
    setError 
  } = useApp();

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
        return <Video className="h-5 w-5 text-red-500" />;
      case 'article':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'course':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      default:
        return <Star className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (recommendationId, newStatus) => {
    await updateRecommendationStatus(recommendationId, newStatus);
  };

  const handleGenerateRecommendations = async () => {
    if (currentStudent) {
      await generateRecommendations(currentStudent.student_id);
    }
  };

  // Filter recommendations based on status and search term
  const filteredRecommendations = recommendations.filter(rec => {
    const matchesFilter = filter === 'all' || rec.status === filter;
    const matchesSearch = rec.resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rec.resource.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    if (!acc[rec.status]) {
      acc[rec.status] = [];
    }
    acc[rec.status].push(rec);
    return acc;
  }, {});

  if (!currentStudent) {
    return (
      <div className="text-center py-12">
        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Student Selected</h3>
        <p className="text-gray-500">Please select a student to view their recommendations.</p>
        <Link to="/" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recommendations</h1>
            <p className="text-gray-600">Personalized learning paths for {currentStudent.name}</p>
          </div>
        </div>
        <button
          onClick={handleGenerateRecommendations}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Regenerate</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{recommendations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New</p>
              <p className="text-2xl font-semibold text-gray-900">
                {groupedRecommendations.recommended?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Play className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {groupedRecommendations.viewed?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {groupedRecommendations.completed?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="recommended">New</option>
              <option value="viewed">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search recommendations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredRecommendations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {recommendations.length === 0 ? 'No Recommendations Yet' : 'No Matching Recommendations'}
          </h3>
          <p className="text-gray-500 mb-4">
            {recommendations.length === 0 
              ? 'Generate AI-powered recommendations based on performance'
              : 'Try adjusting your filters or search terms'
            }
          </p>
          {recommendations.length === 0 && (
            <button
              onClick={handleGenerateRecommendations}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Generate Recommendations
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getTypeIcon(recommendation.resource.type)}
                    <Link
                      to={`/resource/${recommendation.resource.id}`}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600"
                    >
                      {recommendation.resource.title}
                    </Link>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(recommendation.resource.difficulty_level)}`}>
                      {recommendation.resource.difficulty_level}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {recommendation.resource.description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(recommendation.status)}`}>
                      {getStatusIcon(recommendation.status)}
                      <span className="ml-2">
                        {recommendation.status.charAt(0).toUpperCase() + recommendation.status.slice(1)}
                      </span>
                    </span>
                    
                    <div className="flex space-x-2">
                      {recommendation.status === 'recommended' && (
                        <button
                          onClick={() => handleStatusChange(recommendation.id, 'viewed')}
                          className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                        >
                          Mark Viewed
                        </button>
                      )}
                      {recommendation.status === 'viewed' && (
                        <button
                          onClick={() => handleStatusChange(recommendation.id, 'completed')}
                          className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                        >
                          Mark Complete
                        </button>
                      )}
                      <Link
                        to={`/resource/${recommendation.resource.id}`}
                        className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
                      >
                        View Resource Detail
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
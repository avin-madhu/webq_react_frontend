import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Clock, 
  User, 
  Tag, 
  BookOpen,
  Play,
  FileText,
  Video,
  Star,
  Calendar,
  TrendingUp,
  CheckCircle,
  Eye
} from 'lucide-react';
import { useApp } from '../context/appContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import apiService from '../api/apiService';

const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentStudent, 
    recommendations, 
    updateRecommendationStatus,
    error,
    setError 
  } = useApp();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedRecommendation, setRelatedRecommendation] = useState(null);

  useEffect(() => {
    const fetchResourceDetails = async () => {
      try {
        setLoading(true);
        // Find the resource from recommendations first
        const recommendation = recommendations.find(rec => rec.resource.id === parseInt(id));
        console.log(recommendation, "recommendations bruh")
        if (recommendation) {
          setResource(recommendation.resource);
          setRelatedRecommendation(recommendation);
        } else {
          // If not found in recommendations, fetch from API (if available)
          // For now, we'll show a not found message
          setError('Resource not found in current recommendations');
        }
      } catch (err) {
        setError('Failed to fetch resource details');
      } finally {
        setLoading(false);
      }
    };

    fetchResourceDetails();
  }, [id, recommendations, setError]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="h-6 w-6 text-red-500" />;
      case 'article':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'course':
        return <BookOpen className="h-6 w-6 text-green-500" />;
      default:
        return <Star className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'viewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (relatedRecommendation) {
      await updateRecommendationStatus(relatedRecommendation.id, newStatus);
      setRelatedRecommendation(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleStartLearning = () => {
    if (resource.url) {
      window.open(resource.url, '_blank');
      // Mark as viewed if it's currently recommended
      if (relatedRecommendation?.status === 'recommended') {
        handleStatusChange('viewed');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!resource) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Resource Not Found</h3>
        <p className="text-gray-500 mb-4">The requested resource could not be found.</p>
        <Link to="/recommendations" className="text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 inline mr-2" />
          Back to Recommendations
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {/* Navigation */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <nav className="flex space-x-2 text-sm">
          <Link to="/" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
          <span className="text-gray-500">/</span>
          <Link to="/recommendations" className="text-blue-600 hover:text-blue-800">Recommendations</Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-900">{resource.title}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resource Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getTypeIcon(resource.type)}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{resource.title}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getDifficultyColor(resource.difficulty_level)}`}>
                      {resource.difficulty_level}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">
                      <Tag className="h-4 w-4 inline mr-1" />
                      {resource.type}
                    </span>
                  </div>
                </div>
              </div>
              {relatedRecommendation && (
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(relatedRecommendation.status)}`}>
                  {relatedRecommendation.status.charAt(0).toUpperCase() + relatedRecommendation.status.slice(1)}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleStartLearning}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Start Learning</span>
              </button>
              
              {relatedRecommendation?.status === 'recommended' && (
                <button
                  onClick={() => handleStatusChange('viewed')}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>Mark Viewed</span>
                </button>
              )}
              
              {relatedRecommendation?.status === 'viewed' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="bg-green-100 text-green-700 px-4 py-2 rounded-md hover:bg-green-200 flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Mark Complete</span>
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Why Recommended?</h2>
            <p className="text-gray-600 leading-relaxed">
              {relatedRecommendation.reason || 'This resource will help you advance your learning journey. Click "Start Learning" to access the content.'}
            </p>
          </div>

          {/* Additional Details */}
          {(resource.prerequisites || resource.learning_objectives || resource.topics) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Details</h2>
              
              {resource.learning_objectives && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Learning Objectives</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {resource.learning_objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              )}

              {resource.prerequisites && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Prerequisites</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {resource.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              )}

              {resource.topics && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Topics Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.topics.map((topic, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  Estimated time: {resource.estimated_duration || '30-60 minutes'}
                </span>
              </div>
              
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  Difficulty: {resource.difficulty_level}
                </span>
              </div>
              
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  Recommended for: {currentStudent?.name || 'Current student'}
                </span>
              </div>

              {resource.created_at && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    Added: {new Date(resource.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Card */}
          {relatedRecommendation && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${getStatusColor(relatedRecommendation.status)} border-2`}>
                  {relatedRecommendation.status === 'completed' && <CheckCircle className="h-8 w-8" />}
                  {relatedRecommendation.status === 'viewed' && <Eye className="h-8 w-8" />}
                  {relatedRecommendation.status === 'recommended' && <Clock className="h-8 w-8" />}
                </div>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {relatedRecommendation.status}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {relatedRecommendation.status === 'completed' && 'Great job! You\'ve completed this resource.'}
                  {relatedRecommendation.status === 'viewed' && 'You\'re making progress. Mark complete when done.'}
                  {relatedRecommendation.status === 'recommended' && 'Ready to start learning? Click the button above.'}
                </p>
              </div>
            </div>
          )}

          {/* Related Resources Placeholder */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text">
              Related Resources
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                We’re still curating related resources for you.
                <br />
                Check back soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetails;
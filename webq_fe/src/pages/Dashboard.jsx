import React from 'react';
import { User, Award, Target } from 'lucide-react';
import { useApp } from '../context/appContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import PerformanceCard from '../components/PerformanceCard';
import RecommendationCard from '../components/RecommendationCard';

const Dashboard = () => {
  const { 
    currentStudent, 
    performance, 
    recommendations, 
    loading, 
    error, 
    generateRecommendations, 
    updateRecommendationStatus,
    setError 
  } = useApp();

  if (!currentStudent) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Student Selected</h3>
        <p className="text-gray-500">Please select a student from the header to view their dashboard.</p>
      </div>
    );
  }

  const handleGenerateRecommendations = async () => {
    await generateRecommendations(currentStudent.student_id);
  };

  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    if (!acc[rec.status]) {
      acc[rec.status] = [];
    }
    acc[rec.status].push(rec);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      
      {/* Student Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {currentStudent.name}!</h2>
            <p className="text-blue-100">Track your learning progress and discover new resources</p>
          </div>
          <div className="text-right">
            <Award className="h-12 w-12 text-blue-200 mx-auto mb-2" />
            <p className="text-sm text-blue-100">Keep learning!</p>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Performance Section */}
          {performance && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <PerformanceCard performance={performance} />
              </div>
              
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">AI Recommendations</h3>
                    <button
                      onClick={handleGenerateRecommendations}
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      <Target className="h-4 w-4" />
                      <span>Generate New</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-semibold text-orange-600">
                        {groupedRecommendations.recommended?.length || 0}
                      </div>
                      <div className="text-sm text-gray-500">New</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-blue-600">
                        {groupedRecommendations.viewed?.length || 0}
                      </div>
                      <div className="text-sm text-gray-500">In Progress</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-green-600">
                        {groupedRecommendations.completed?.length || 0}
                      </div>
                      <div className="text-sm text-gray-500">Completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Your Personalized Recommendations</h3>
            
            {recommendations.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Yet</h4>
                <p className="text-gray-500 mb-4">Generate AI-powered recommendations based on your performance</p>
                <button
                  onClick={handleGenerateRecommendations}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  Generate Recommendations
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map(recommendation => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                    onStatusUpdate={updateRecommendationStatus}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
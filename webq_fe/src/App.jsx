import React, { useState, useContext, createContext, useEffect } from 'react';
import { 
  BookOpen, 
  TrendingUp, 
  User, 
  CheckCircle, 
  Clock, 
  Play, 
  ArrowRight,
  Star,
  BarChart3,
  Target,
  Award,
  RefreshCw
} from 'lucide-react';

// API Service
const API_BASE_URL = 'http://localhost:8000/api';

const apiService = {
  // Students
  getStudents: () => fetch(`${API_BASE_URL}/students/`).then(res => res.json()),
  getStudent: (id) => fetch(`${API_BASE_URL}/students/${id}/`).then(res => res.json()),
  
  // Performance
  getStudentPerformance: (id) => fetch(`${API_BASE_URL}/student/${id}/performance/`).then(res => res.json()),
  
  // Resources
  getResources: () => fetch(`${API_BASE_URL}/resources/`).then(res => res.json()),
  
  // Recommendations
  generateRecommendations: (studentId) => 
    fetch(`${API_BASE_URL}/recommendations/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, forced_regenerate: true, max_recommendations: 5 })
    }).then(res => res.json()),
  
  getRecommendations: (studentId) => 
    fetch(`${API_BASE_URL}/recommendations/${studentId}/`).then(res => res.json()),
  
  updateRecommendationStatus: (recommendationId, status) =>
    fetch(`${API_BASE_URL}/recommendations/update/${recommendationId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).then(res => res.json()),
  
  // Analytics
  getDashboardAnalytics: () => fetch(`${API_BASE_URL}/analytics/dashboard/`).then(res => res.json())
};

// Context for global state management
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await apiService.getStudents();
      setStudents(data);
      if (data.length > 0 && !currentStudent) {
        setCurrentStudent(data[0]);
      }
    } catch (err) {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentData = async (studentId) => {
  try {
    setLoading(true);
    const [performanceData, recommendationsData] = await Promise.all([
      apiService.getStudentPerformance(studentId),
      apiService.getRecommendations(studentId)
    ]);
    console.log("Fetched Recommendations:", recommendationsData);
    setPerformance(performanceData);
    setRecommendations(recommendationsData.recommendations || []);

  } catch (err) {
    setError('Failed to fetch student data');
    setRecommendations([]);
  } finally {
    setLoading(false);
  }
};

  const generateRecommendations = async (studentId) => {
    try {
      setLoading(true);
      await apiService.generateRecommendations(studentId);
      await fetchStudentData(studentId);
    } catch (err) {
      setError('Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  const updateRecommendationStatus = async (recommendationId, status) => {
    try {
      await apiService.updateRecommendationStatus(recommendationId, status);
      if (currentStudent) {
        await fetchStudentData(currentStudent.student_id);
      }
    } catch (err) {
      setError('Failed to update recommendation status');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (currentStudent) {
      fetchStudentData(currentStudent.student_id);
    }
  }, [currentStudent]);

  return (
    <AppContext.Provider value={{
      currentStudent,
      setCurrentStudent,
      students,
      performance,
      recommendations,
      resources,
      loading,
      error,
      fetchStudentData,
      generateRecommendations,
      updateRecommendationStatus,
      setError
    }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Components
const Header = () => {
  const { currentStudent, students, setCurrentStudent } = useApp();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-semibold text-gray-900">Learning Paths</h1>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentStudent?.student_id || ''}
              onChange={(e) => {
                const student = students.find(s => s.student_id === parseInt(e.target.value));
                setCurrentStudent(student);
              }}
            >
              <option value="">Select Student</option>
              {students.map(student => (
                <option key={student.student_id} value={student.student_id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
  </div>
);

const ErrorMessage = ({ message, onDismiss }) => (
  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
    <div className="flex">
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">Error</h3>
        <div className="mt-2 text-sm text-red-700">{message}</div>
        <div className="mt-4">
          <button
            onClick={onDismiss}
            className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  </div>
);

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

const App = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Dashboard />
        </main>
      </div>
    </AppProvider>
  );
};

export default App;
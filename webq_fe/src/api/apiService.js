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

export default apiService;
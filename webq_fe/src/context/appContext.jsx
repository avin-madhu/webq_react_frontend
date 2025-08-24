import React, { useState, useContext, createContext, useEffect } from 'react';
import apiService from '../api/apiService';

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

    console.log("Fetched Performance:", performanceData);
    console.log("Fetched Recommendations:", recommendationsData);

    setPerformance(performanceData);

    // If API already returns an array, don't assume `.recommendations`
    setRecommendations(Array.isArray(recommendationsData) 
      ? recommendationsData 
      : recommendationsData.recommendations || []
    );

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

  const handleStudentChange = async (student) => {
    console.log("Changing to student:", student);
    setCurrentStudent(student);
    if (student) {
      await fetchStudentData(student.student_id);
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

export { AppProvider, useApp };
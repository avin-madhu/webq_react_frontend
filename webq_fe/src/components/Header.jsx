import React from 'react';
import { BookOpen } from 'lucide-react';
import { useApp } from '../context/appContext';

const Header = () => {
  const { currentStudent, students, setCurrentStudent } = useApp();

  const handleStudentSelect = (e) => {
    console.log("handle student select called!")
    const studentId = e.target.value;
    console.log(studentId)
    if (studentId) {
      const student = students.find(s => s.student_id === studentId);
      console.log("Selected student from dropdown:", student);
      setCurrentStudent(student);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-xl font-semibold text-gray-900">WebQ</h1>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentStudent?.student_id || ''}
              onChange={handleStudentSelect}
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

export default Header;
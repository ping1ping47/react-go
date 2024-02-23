import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/Signin/';
import Register from './components/Register';
import Nav from './components/Nav';
import TeachersList from './components/Teachers/ListTeachers';
import SubjectList from './components/Subjects/ListSubjects';
import StudentCRUD from './components/Students/ListStudents';
import List from './components/List';
import UserList from './components/Users/UserList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleRegisterSuccess = () => {
    setIsRegister(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Nav isLoggedIn={isLoggedIn} isRegister={isRegister} onLogout={handleLogout} />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/signin" element={<SignIn onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register onRegisterSuccess={handleRegisterSuccess} />} />
            <Route path="/" element={<List />} />
            <Route path="/teachers" element={<TeachersList />} />
            <Route path="/subjects" element={<SubjectList/>} />
            <Route path="/students" element={<StudentCRUD/>} />
            <Route path="/List" element={<List/>} />
            <Route path="/users" element={<UserList/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

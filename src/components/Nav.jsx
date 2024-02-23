import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Nav.css'; // Tell webpack that Button.js uses these styles

const Nav = ({ isLoggedIn, onLogout }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
          const response = await axios.get(`http://localhost:5000/users?Email=${loggedInUser}`);
          const userData = response.data[0];
          if (userData && userData.Name) {
            setName(userData.Name);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
  
    fetchUserData();
  }, []);

  const handleLogout = () => {
    onLogout();
    localStorage.removeItem('loggedInUser');
    window.location.href = '/signin';
  };

  return (
    <nav className="menu" id="nav">
      <span className="nav-item active">
        <span className="icon">
          <i data-feather="home"></i>
        </span>
        <Link to="/List">หน้าหลัก</Link>
      </span>
      {isLoggedIn && (
        <>
          <span className="nav-item">
            <span className="icon">
              <i data-feather="user"></i>
            </span>
            <Link to="/users">ตารางผู้ใช้</Link>
          </span>
          <span className="nav-item">
            <span className="icon">
              <i data-feather="users"></i>
            </span>
            <Link to="/teachers">ตารางครู</Link>
          </span>
          <span className="nav-item">
            <span className="icon">
              <i data-feather="book"></i>
            </span>
            <Link to="/students">ตารางนักเรียน</Link>
          </span>
          <span className="nav-item">
            <span className="icon">
              <i data-feather="list"></i>
            </span>
            <Link to="/subjects">ตารางวิชา</Link>
          </span>
          <span className="nav-item">
            
            <button onClick={handleLogout} className="text-white hover:text-gray-300 bg-transparent border border-white px-2 rounded">ออกจากระบบ</button>
          </span>
        </>
      )}
      {!isLoggedIn && (
        <>
          <span className="nav-item">
            <span className="icon">
              <i data-feather="log-in"></i>
            </span>
            <Link to="/signin">เข้าสู่ระบบ</Link>
          </span>
          <span className="nav-item">
            <span className="icon">
              <i data-feather="user-plus"></i>
            </span>
            <Link to="/register">ลงทะเบียน</Link>
          </span>
        </>
      )}
    </nav>
  );
}

export default Nav;

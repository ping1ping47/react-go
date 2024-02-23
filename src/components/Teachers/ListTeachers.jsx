import React, { useState, useEffect } from "react";
import DeleteTeachers from "./DeleteTeachers";
import EditTeachers from "./EditTeachers";
import CreateTeachers from "./AddTeachers";

const ListTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherIDToDelete, setTeacherIDToDelete] = useState(null);
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [teachersPerPage, setTeachersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTeachers = async () => {
    try {
      const response = await fetch("http://localhost:5000/teachers");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setShowEditModal(true);
  };

  const handleDelete = (teacherID) => {
    setTeacherIDToDelete(teacherID);
    setShowDeleteModal(true);
  };

  const handleInsert = () => {
    setShowInsertModal(true);
  };

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTeachers = teachers.filter((teacher) => {
    return (
      teacher.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.LastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.Age.toString().includes(searchTerm) ||
      teacher.TeachingSubject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(
    indexOfFirstTeacher,
    indexOfLastTeacher
  );

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredTeachers.length / teachersPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">ตารางข้อมูลครู</h1>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="ค้นหาตามชื่อ, นามสกุล, อายุ, หรือวิชาที่สอน"
          className="border border-gray-300 rounded px-6 py-2 text-black"
        />
      </div>

      <button
        onClick={handleInsert}
        className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        เพิ่มครู
      </button>

      {isLoading && <p className="text-gray-600">กำลังโหลด...</p>}
      {error && <p className="text-red-600">เกิดข้อผิดพลาด: {error}</p>}

      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr className="bg-gray-800">
            <th className="border px-4 py-2">ชื่อ</th>
            <th className="border px-4 py-2">นามสกุล</th>
            <th className="border px-4 py-2">อายุ</th>
            <th className="border px-4 py-2">วิชาที่สอน</th>
            <th className="border px-4 py-2">การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {currentTeachers.map((teacher) => (
            <tr key={teacher.ID} className="text-center">
              <td className="border px-4 py-2">{teacher.FirstName}</td>
              <td className="border px-4 py-2">{teacher.LastName}</td>
              <td className="border px-4 py-2">{teacher.Age}</td>
              <td className="border px-4 py-2">{teacher.TeachingSubject}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => handleEdit(teacher)}
                >
                  แก้ไข
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleDelete(teacher.ID)}
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditModal && (
        <EditTeachers
          teacher={selectedTeacher}
          onClose={() => setShowEditModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteTeachers
          teacherID={teacherIDToDelete}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
      {showInsertModal && (
        <CreateTeachers onClose={() => setShowInsertModal(false)} />
      )}
    </div>
  );
};

export default ListTeachers;

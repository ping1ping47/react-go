import React, { useState, useEffect } from "react";
import DeleteStudents from "./DeleteStudents";
import EditStudents from "./EditStudents";
import CreateStudents from "./AddStudents";

const ListStudents = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentIDToDelete, setStudentIDToDelete] = useState(null);
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/students");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleDelete = (studentID) => {
    setStudentIDToDelete(studentID);
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

  const filteredStudents = students.filter((student) => {
    return (
      student.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.LastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.Age.toString().includes(searchTerm)
    );
  });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredStudents.length / studentsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">ตารางข้อมูลนักเรียน</h1>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="ค้นหาตามชื่อ, นามสกุล, หรืออายุ"
          className="border border-gray-300 rounded px-6 py-2 text-black"
        />
      </div>

      <button
        onClick={handleInsert}
        className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        เพิ่มนักเรียน
      </button>

      {isLoading && <p className="text-gray-600">กำลังโหลด...</p>}
      {error && <p className="text-red-600">เกิดข้อผิดพลาด: {error}</p>}

      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr className="bg-gray-800">
            <th className="border px-4 py-2">ชื่อ</th>
            <th className="border px-4 py-2">นามสกุล</th>
            <th className="border px-4 py-2">อายุ</th>
            <th className="border px-4 py-2">การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student) => (
            <tr key={student.ID} className="text-center">
              <td className="border px-4 py-2">{student.FirstName}</td>
              <td className="border px-4 py-2">{student.LastName}</td>
              <td className="border px-4 py-2">{student.Age}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => handleEdit(student)}
                >
                  แก้ไข
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleDelete(student.ID)}
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditModal && (
        <EditStudents
          student={selectedStudent}
          onClose={() => setShowEditModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteStudents
          studentID={studentIDToDelete}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
      {showInsertModal && (
        <CreateStudents onClose={() => setShowInsertModal(false)} />
      )}
    </div>
  );
};

export default ListStudents;

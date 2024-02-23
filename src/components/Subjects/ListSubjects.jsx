import React, { useState, useEffect } from "react";
import DeleteSubjects from "./DeleteSubjects";
import CreateSubjects from "./AddSubjects";
import EditSubjects from "./EditSubjects";

const ListSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subjectIDToDelete, setSubjectIDToDelete] = useState(null);
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [subjectsPerPage, setSubjectsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSubjects = async () => {
    try {
      const response = await fetch("http://localhost:5000/subjects");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setShowEditModal(true);
  };

  const handleDelete = (subjectID) => {
    setSubjectIDToDelete(subjectID);
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

  const filteredSubjects = subjects.filter((subject) => {
    return (
      subject.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.Description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = filteredSubjects.slice(
    indexOfFirstSubject,
    indexOfLastSubject
  );

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredSubjects.length / subjectsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">รายการวิชา</h1>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="ค้นหาตามชื่อวิชาหรือรายละเอียด"
          className="border border-gray-300 rounded px-6 py-2 text-black"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleInsert}
          className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          เพิ่มวิชา
        </button>
      </div>

      {isLoading && <p className="text-gray-600">กำลังโหลด...</p>}
      {error && <p className="text-red-600">เกิดข้อผิดพลาด: {error}</p>}
      
      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr className="bg-gray-800">
            <th className="border px-4 py-2">ชื่อ</th>
            <th className="border px-4 py-2">รายละเอียด</th>
            <th className="border px-4 py-2">การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {currentSubjects.map((subject) => (
            <tr key={subject.ID} className="text-center">
              <td className="border px-4 py-2">{subject.Name}</td>
              <td className="border px-4 py-2">{subject.Description}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => handleEdit(subject)}
                >
                  แก้ไข
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleDelete(subject.ID)}
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditModal && (
        <EditSubjects
          subject={selectedSubject}
          onClose={() => setShowEditModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteSubjects
          subjectID={subjectIDToDelete}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
      {showInsertModal && (
        <CreateSubjects onClose={() => setShowInsertModal(false)} />
      )}
    </div>
  );
};

export default ListSubjects;

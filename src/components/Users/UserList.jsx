import React, { useState, useEffect } from "react";
import DeleteUsers from "./DeleteUsers";
import CreateUsers from "./AddUsers";
import EditUsers from "./EditUsers";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userIDToDelete, setUserIDToDelete] = useState(null);
  const [showInsertModal, setShowInsertModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (userID) => {
    setUserIDToDelete(userID);
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

  const filteredUsers = users.filter((user) => {
    return (
      user.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredUsers.length / usersPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">รายการผู้ใช้</h1>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="ค้นหาตามชื่อผู้ใช้หรืออีเมล"
          className="border border-gray-300 rounded px-6 py-2 text-black"
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleInsert}
          className="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          เพิ่มผู้ใช้
        </button>
      </div>

      {isLoading && <p className="text-gray-600">กำลังโหลด...</p>}
      {error && <p className="text-red-600">เกิดข้อผิดพลาด: {error}</p>}
      
      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr className="bg-gray-800">
            <th className="border px-4 py-2">ชื่อ</th>
            <th className="border px-4 py-2">อีเมล</th>
            <th className="border px-4 py-2">การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.ID} className="text-center">
              <td className="border px-4 py-2">{user.Name}</td>
              <td className="border px-4 py-2">{user.Email}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => handleEdit(user)}
                >
                  แก้ไข
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleDelete(user.ID)}
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditModal && (
        <EditUsers
          user={selectedUser}
          onClose={() => setShowEditModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteUsers
          userID={userIDToDelete}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
      {showInsertModal && (
        <CreateUsers onClose={() => setShowInsertModal(false)} />
      )}
    </div>
  );
};

export default UserList;

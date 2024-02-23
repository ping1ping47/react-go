import React, { useEffect, useState } from 'react';
import './List.css'; // Tell webpack that Button.js uses these styles
<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />

const List = () => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTeachers = async () => {
        try {
            const response = await fetch('http://localhost:5000/teachers');
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

    const fetchStudents = async () => {
        try {
            const response = await fetch('http://localhost:5000/students');
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

    const fetchSubjects = async () => {
        try {
            const response = await fetch('http://localhost:5000/subjects');
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

    const refreshData = () => {
        setIsLoading(true);
        setError(null);
        fetchTeachers();
        fetchStudents();
        fetchSubjects();
    };

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <div className="container-fluid p-4 futuristic">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2 text-green-400">รายชื่อครู</h1>
                {isLoading && <p>กำลังโหลดข้อมูลครู...</p>}
                {error && <p className="text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูลครู: {error}</p>}
                <div className="grid grid-cols-4 gap-4">
                    {teachers.map(teacher => (
                        <div key={teacher.id} className="bg-green-800 p-4 rounded-lg border border-green-400 text-white hover:shadow-md transition duration-300">
                            <p className="font-bold">ชื่อ: {teacher.FirstName} {teacher.LastName}</p>
                            <p className="text-gray-300">อายุ: {teacher.Age}</p>
                            <p className="text-gray-300">วิชาที่สอน: {teacher.TeachingSubject}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2 text-blue-400">รายชื่อนักเรียน</h1>
                {isLoading && <p>กำลังโหลดข้อมูลนักเรียน...</p>}
                {error && <p className="text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูลนักเรียน: {error}</p>}
                <div className="grid grid-cols-5 gap-4">
                    {students.map(student => (
                        <div key={student.id} className="bg-blue-500 p-4 rounded-lg border border-blue-900 text-white hover:shadow-md transition duration-300">
                            <p className="font-bold">ชื่อ: {student.FirstName} {student.LastName}</p>
                            <p className="text-gray-300">อายุ: {student.Age}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h1 className="text-2xl font-bold mb-2 text-yellow-400">รายชื่อวิชา</h1>
                {isLoading && <p>กำลังโหลดข้อมูลวิชา...</p>}
                {error && <p className="text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูลวิชา: {error}</p>}
                <div className="grid grid-cols-3 gap-4">
                    {subjects.map(subject => (
                        <div key={subject.id} className="bg-yellow-800 p-4 rounded-lg border border-yellow-400 text-white hover:shadow-md transition duration-300">
                            <p className="font-bold">ชื่อ: {subject.Name}</p>
                            <p className="text-gray-300">รายละเอียด: {subject.Description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded mt-4" onClick={refreshData}>รีเฟรชข้อมูล</button>
        </div>
    );
};

export default List;

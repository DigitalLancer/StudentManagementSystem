import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';

function StudentDashboard() {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        fetchStudentData();
    }, []);
    const fetchStudentData = async () => {
        try {
            const enrollResponse = await fetch('https://localhost:7002/api/Enrollments');
            const allEnrollments = await enrollResponse.json();
            const studentEnrollments = allEnrollments.filter(e => e.studentId === user.id);

            const courseResponse = await fetch('https://localhost:7002/api/Courses');
            const allCourses = await courseResponse.json();

            setEnrollments(studentEnrollments);
            setCourses(allCourses);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getCourseName = (courseId) => {
        const course = courses.find(c => c.id === courseId);
        return course ? course.courseName : 'Unknown Course';
    };

    const calculateAverage = () => {
        const gradeMap = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0 };
        const validGrades = enrollments.filter(e => e.grade && gradeMap[e.grade]);
        if (validGrades.length === 0) return 'N/A';
        const sum = validGrades.reduce((acc, e) => acc + (gradeMap[e.grade] || 0), 0);
        return (sum / validGrades.length).toFixed(2);
    };

    return (
        <div className="dashboard">
            <h2>Öğrenci Paneli</h2>

            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-value">{enrollments.length}</div>
                    <div className="stat-label">Kayıtlı Ders</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{calculateAverage()}</div>
                    <div className="stat-label">Ortalama</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{enrollments.reduce((acc, e) => acc + (e.absence || 0), 0)}</div>
                    <div className="stat-label">Toplam Devamsızlık</div>
                </div>
            </div>

            <div className="info-card">
                <h3>Kişisel Bilgiler</h3>
                <p><strong>Ad Soyad:</strong> {user.username}</p>
                <p><strong>E-posta:</strong> {user.email}</p>
                <p><strong>Rol:</strong> {user.role}</p>
            </div>

            <div className="courses-section">
                <h3>Kayıtlı Dersler</h3>
                <div className="course-list">
                    {enrollments.map(enrollment => (
                        <div key={enrollment.id} className="course-card">
                            <h4>{getCourseName(enrollment.courseId)}</h4>
                            <div className="course-details">
                                <p><strong>Not:</strong> <span className="grade">{enrollment.grade || 'Henüz not verilmedi'}</span></p>
                                <p><strong>Devamsızlık:</strong> <span className="absence">{enrollment.absence || 0} gün</span></p>
                            </div>
                        </div>
                    ))}
                    {enrollments.length === 0 && (
                        <p className="no-data">Kayıtlı ders bulunmamaktadır.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard
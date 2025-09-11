import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';

function TeacherDashboard() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [enrollments, setEnrollments] = useState([]);
    const [students, setStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [editingGrade, setEditingGrade] = useState(null);
    const [editingAbsence, setEditingAbsence] = useState(null);
    const [showAddStudent, setShowAddStudent] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState('');

    useEffect(() => {
        fetchTeacherData();
        fetchAllStudents();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchCourseStudents();
        }
    }, [selectedCourse]);

    const fetchTeacherData = async () => {
        try {
            const response = await fetch('https://localhost:7002/api/Courses');
            const allCourses = await response.json();
            const teacherCourses = allCourses.filter(c => c.teacherId === user.id);
            setCourses(teacherCourses);
        } catch (error) {
            console.error('Error:', error);
            alert('Dersler yüklenirken bir hata oluştu');
        }
    };

    const fetchAllStudents = async () => {
        try {
            const response = await fetch('https://localhost:7002/api/Users');
            const allUsers = await response.json();
            const studentUsers = allUsers.filter(u => u.role === 'Student');
            setAllStudents(studentUsers);
        } catch (error) {
            console.error('Error:', error);
            alert('Öğrenci listesi yüklenirken bir hata oluştu');
        }
    };

    const fetchCourseStudents = async () => {
        try {
            const enrollResponse = await fetch('https://localhost:7002/api/Enrollments');
            const allEnrollments = await enrollResponse.json();
            const courseEnrollments = allEnrollments.filter(e => e.courseId === selectedCourse.id);

            const userResponse = await fetch('https://localhost:7002/api/Users');
            const allUsers = await userResponse.json();
            const studentUsers = allUsers.filter(u => u.role === 'Student');

            setEnrollments(courseEnrollments);
            setStudents(studentUsers);
        } catch (error) {
            console.error('Error:', error);
            alert('Öğrenci listesi yüklenirken bir hata oluştu');
        }
    };

    const getStudentName = (studentId) => {
        const student = students.find(s => s.id === studentId);
        return student ? student.username : 'Unknown Student';
    };

    const getAvailableStudents = () => {
        const enrolledStudentIds = enrollments.map(e => e.studentId);
        return allStudents.filter(s => !enrolledStudentIds.includes(s.id));
    };

    const addStudentToCourse = async () => {
        if (!selectedStudentId) {
            alert('Lütfen bir öğrenci seçin');
            return;
        }

        try {
            const response = await fetch('https://localhost:7002/api/Enrollments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: selectedCourse.id,
                    studentId: parseInt(selectedStudentId),
                    grade: null,
                    absence: 0
                })
            });

            if (response.ok) {
                fetchCourseStudents(); 
                setShowAddStudent(false);
                setSelectedStudentId('');
                alert('Öğrenci başarıyla eklendi');
            } else {
                const error = await response.json();
                alert(error.message || 'Öğrenci eklenirken bir hata oluştu');
            }
        } catch (error) {
            console.error('Error adding student:', error);
            alert('Sunucuya bağlanılamadı');
        }
    };

    const removeStudentFromCourse = async (enrollmentId, studentName) => {
        if (window.confirm(`${studentName} öğrencisini dersten çıkarmak istediğinizden emin misiniz?`)) {
            try {
                const response = await fetch(`https://localhost:7002/api/Enrollments/${enrollmentId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    fetchCourseStudents();
                    alert('Öğrenci dersten çıkarıldı');
                } else {
                    alert('Öğrenci çıkarılırken bir hata oluştu');
                }
            } catch (error) {
                console.error('Error removing student:', error);
                alert('Sunucuya bağlanılamadı');
            }
        }
    };

    const updateGrade = async (enrollmentId, newGrade) => {
        try {
            const enrollment = enrollments.find(e => e.id === enrollmentId);
            const response = await fetch(`https://localhost:7002/api/Enrollments/${enrollmentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...enrollment, grade: newGrade })
            });

            if (response.ok) {
                fetchCourseStudents();
                setEditingGrade(null);
            } else {
                const error = await response.json();
                alert(error.message || 'Not güncellenemedi');
            }
        } catch (error) {
            console.error('Error updating grade:', error);
            alert('Sunucuya bağlanılamadı');
        }
    };

    const updateAbsence = async (enrollmentId, newAbsence) => {
        try {
            const enrollment = enrollments.find(e => e.id === enrollmentId);
            const response = await fetch(`https://localhost:7002/api/Enrollments/${enrollmentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...enrollment, absence: parseInt(newAbsence) })
            });

            if (response.ok) {
                fetchCourseStudents();
                setEditingAbsence(null);
            } else {
                const error = await response.json();
                alert(error.message || 'Devamsızlık güncellenemedi');
            }
        } catch (error) {
            console.error('Error updating absence:', error);
            alert('Sunucuya bağlanılamadı');
        }
    };

    return (
        <div className="dashboard">
            <h2>Öğretmen Paneli</h2>

            <div className="courses-section">
                <h3>Derslerim</h3>
                <div className="course-list">
                    {courses.map(course => (
                        <div
                            key={course.id}
                            className={`course-card ${selectedCourse?.id === course.id ? 'selected' : ''}`}
                            onClick={() => setSelectedCourse(course)}
                        >
                            <h4>{course.courseName}</h4>
                            <p>Ders ID: {course.id}</p>
                        </div>
                    ))}
                    {courses.length === 0 && (
                        <p className="no-data">Henüz ders atamanız bulunmamaktadır.</p>
                    )}
                </div>
            </div>

            {selectedCourse && (
                <div className="students-section">
                    <div className="section-header">
                        <h3>{selectedCourse.courseName} - Öğrenci Listesi ({enrollments.length})</h3>
                        <button
                            className="btn-primary"
                            onClick={() => {
                                setShowAddStudent(!showAddStudent);
                                console.log('Available students when opening form:', getAvailableStudents());
                            }}
                        >
                            Öğrenci Ekle
                        </button>
                    </div>

                    {showAddStudent && (
                        <div className="add-student-form">
                            <select
                                value={selectedStudentId}
                                onChange={(e) => setSelectedStudentId(e.target.value)}
                            >
                                <option value="">Öğrenci Seçin</option>
                                {getAvailableStudents().map(student => (
                                    <option key={student.id} value={student.id}>
                                        {student.username} - {student.email}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={addStudentToCourse}
                                className="btn-primary"
                                disabled={!selectedStudentId}
                            >
                                Ekle
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddStudent(false);
                                    setSelectedStudentId('');
                                }}
                            >
                                İptal
                            </button>

                            {getAvailableStudents().length === 0 && (
                                <p className="info-message">
                                    Eklenebilecek öğrenci bulunmamaktadır.
                                    (Tüm öğrenciler: {allStudents.length}, Kayıtlı: {enrollments.length})
                                </p>
                            )}
                        </div>
                    )}

                    {enrollments.length > 0 ? (
                        <table className="students-table">
                            <thead>
                                <tr>
                                    <th>Öğrenci Adı</th>
                                    <th>E-posta</th>
                                    <th>Not</th>
                                    <th>Devamsızlık</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollments.map(enrollment => {
                                    const student = students.find(s => s.id === enrollment.studentId);
                                    return (
                                        <tr key={enrollment.id}>
                                            <td>{getStudentName(enrollment.studentId)}</td>
                                            <td>{student?.email || '-'}</td>
                                            <td>
                                                {editingGrade === enrollment.id ? (
                                                    <input
                                                        type="text"
                                                        defaultValue={enrollment.grade}
                                                        onBlur={(e) => updateGrade(enrollment.id, e.target.value)}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                updateGrade(enrollment.id, e.target.value);
                                                            }
                                                        }}
                                                        autoFocus
                                                        className="edit-input"
                                                    />
                                                ) : (
                                                    <span onClick={() => setEditingGrade(enrollment.id)} className="editable">
                                                        {enrollment.grade || 'Not ver'}
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                {editingAbsence === enrollment.id ? (
                                                    <input
                                                        type="number"
                                                        defaultValue={enrollment.absence || 0}
                                                        onBlur={(e) => updateAbsence(enrollment.id, e.target.value)}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                updateAbsence(enrollment.id, e.target.value);
                                                            }
                                                        }}
                                                        autoFocus
                                                        className="edit-input"
                                                        min="0"
                                                    />
                                                ) : (
                                                    <span onClick={() => setEditingAbsence(enrollment.id)} className="editable">
                                                        {enrollment.absence || 0}
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => setEditingGrade(enrollment.id)}
                                                    >
                                                        Not Düzenle
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => removeStudentFromCourse(
                                                            enrollment.id,
                                                            getStudentName(enrollment.studentId)
                                                        )}
                                                    >
                                                        Dersten Çıkar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-data">Bu derse henüz öğrenci eklenmemiş.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default TeacherDashboard
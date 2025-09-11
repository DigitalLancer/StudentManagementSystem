import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [showAddCourse, setShowAddCourse] = useState(false);
    const [newCourse, setNewCourse] = useState({ courseName: '', teacherId: '' });
    const [activeTab, setActiveTab] = useState('courses');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const courseResponse = await fetch('https://localhost:7002/api/Courses');
            const coursesData = await courseResponse.json();
            setCourses(coursesData);

            const userResponse = await fetch('https://localhost:7002/api/Users');
            const usersData = await userResponse.json();
            
            const nonAdminUsers = usersData.filter(u => u.role !== 'Admin');
            setUsers(nonAdminUsers);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const addCourse = async () => {
        if (!newCourse.courseName || !newCourse.teacherId) {
            alert('Lütfen tüm alanları doldurun');
            return;
        }

        try {
            const response = await fetch('https://localhost:7002/api/Courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCourse)
            });

            if (response.ok) {
                fetchData();
                setShowAddCourse(false);
                setNewCourse({ courseName: '', teacherId: '' });
                alert('Ders başarıyla eklendi!');
            }
        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    const deleteCourse = async (courseId) => {
        if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
            try {
                const response = await fetch(`https://localhost:7002/api/Courses/${courseId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    fetchData();
                }
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
    };

    const deleteUser = async (userId) => {
        if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
            try {
                const response = await fetch(`https://localhost:7002/api/Users/${userId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    fetchData();
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const getTeacherName = (teacherId) => {
        const teacher = users.find(u => u.id === teacherId && u.role === 'Teacher');
        return teacher ? teacher.username : 'Atanmamış';
    };

    return (
        <div className="dashboard">
            <h2>Admin Paneli</h2>

            <div className="tabs">
                <button
                    className={activeTab === 'courses' ? 'active' : ''}
                    onClick={() => setActiveTab('courses')}
                >
                    Dersler
                </button>
                <button
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    Kullanıcılar
                </button>
            </div>

            {activeTab === 'courses' && (
                <div className="admin-section">
                    <div className="section-header">
                        <h3>Ders Yönetimi</h3>
                        <button
                            className="btn-primary"
                            onClick={() => setShowAddCourse(!showAddCourse)}
                        >
                            Yeni Ders Ekle
                        </button>
                    </div>

                    {showAddCourse && (
                        <div className="add-course-form">
                            <input
                                type="text"
                                placeholder="Ders Adı"
                                value={newCourse.courseName}
                                onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })}
                            />
                            <select
                                value={newCourse.teacherId}
                                onChange={(e) => setNewCourse({ ...newCourse, teacherId: e.target.value })}
                            >
                                <option value="">Öğretmen Seç</option>
                                {users.filter(u => u.role === 'Teacher').map(teacher => (
                                    <option key={teacher.id} value={teacher.id}>{teacher.username}</option>
                                ))}
                            </select>
                            <button onClick={addCourse} className="btn-primary">Ekle</button>
                            <button onClick={() => setShowAddCourse(false)}>İptal</button>
                        </div>
                    )}

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Ders ID</th>
                                <th>Ders Adı</th>
                                <th>Öğretmen</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id}>
                                    <td>{course.id}</td>
                                    <td>{course.courseName}</td>
                                    <td>{getTeacherName(course.teacherId)}</td>
                                    <td>
                                        <button
                                            className="btn-delete"
                                            onClick={() => deleteCourse(course.id)}
                                        >
                                            Sil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="admin-section">
                    <h3>Kullanıcı Yönetimi</h3>

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ad Soyad</th>
                                <th>E-posta</th>
                                <th>Rol</th>
                                <th>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge ${user.role.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-delete"
                                            onClick={() => deleteUser(user.id)}
                                        >
                                            Sil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard
import React from 'react'
import { useAuth } from '../context/AuthContext';

function Navigation() {
    const { user, logout } = useAuth();
    const roleMap = {
        Student: "Öğrenci",
        Teacher: "Öğretmen",
        Admin: "Admin"
    };
    return (
        <nav className="navbar">
            <div className="nav-container">
                <h1>Okul Yönetim</h1>
                <div className="nav-user">
                    <span>{user?.username} ({roleMap[user?.role] ?? user?.role})</span>
                    <button onClick={logout} className="btn-logout">Çıkış</button>
                </div>
            </div>
        </nav>
    )
}

export default Navigation
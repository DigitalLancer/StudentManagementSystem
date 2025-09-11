import { useState } from 'react'
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Navigation from './components/Navigation';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  if (!user) {
    return <Login />;
  }
  return (
    <div className="app">
      <Navigation/>
      <div className="main-content">
        {user.role === 'Student' && <StudentDashboard />}
        {user.role === 'Teacher' && <TeacherDashboard />}
        {user.role === 'Admin' && <AdminDashboard />}
      </div>
    </div>
  );
}

export default App

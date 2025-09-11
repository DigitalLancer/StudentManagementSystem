import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext';
function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    role: 'Student'
  });
  const { login } = useAuth();

  const handleSubmit = async () => {
    if (isLogin) {
      try {
        const response = await fetch('https://localhost:7002/api/Users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        if (response.ok) {
          const userData = await response.json();

          if (userData.token) {
            localStorage.setItem('token', userData.token);
          }

          login({
            id: userData.id,
            email: userData.email,
            username: userData.username,
            role: userData.role
          });
        } else {
          const error = await response.json();
          alert(error.message || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Could not connect to server');
      }
    } else {
      try {
        const response = await fetch('https://localhost:7002/api/Users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            username: formData.username,
            role: formData.role
          })
        });

        if (response.ok) {
          const userData = await response.json();

          login({
            id: userData.id,
            email: userData.email,
            username: userData.username,
            role: userData.role
          });

          alert('Registration successful! You are now logged in.');
        } else {
          const error = await response.json();
          alert(error.message || 'Registration failed');
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert('Could not connect to server');
      }
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
        <div className="form-group">
          <input
            type="email"
            placeholder="E-posta"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Şifre"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Ad Soyad"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Student">Öğrenci</option>
                <option value="Teacher">Öğretmen</option>
                <option value="Admin">Admin</option>
              </select>
            </>
          )}

          <button onClick={handleSubmit} className="btn-primary">
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </div>

        <p className="toggle-auth">
          {isLogin ? "Hesabınız yok mu? " : "Zaten hesabınız var mı? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login
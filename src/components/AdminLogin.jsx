import React, { useContext, useState } from 'react';
import { adminLogin } from '../services/userServices';
import { UserContext } from '../contexts/UserContext';

const AdminLogin = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {setIsLogin} = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await adminLogin(username, password);
      if (result.status === true) {
        setIsLogin(true);
        onLogin();
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error(error);
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-modal">
        <div className="admin-login-header">
          <h2>Admin Girişi</h2>
          <button className="close-login" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <div className="login-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Kullanıcı Adı</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adınızı girin"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
              disabled={isLoading}
              required
            />
          </div>

          <button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 
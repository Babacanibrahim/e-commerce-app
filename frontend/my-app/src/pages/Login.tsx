import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://localhost:7264/api/User/login', {
                userName: username,
                password,
            });

            const { token, role } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('role', role);

            if (role === 0) {
                navigate('/admin');
            } else {
                navigate('/home');
            }
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError('Böyle bir kullanıcı yok veya şifre yanlış.');
            } else {
                setError('Sunucuya ulaşılamıyor.');
            }
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2>Giriş Yap</h2>
                <input
                    type="text"
                    placeholder="Kullanıcı Adı"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="auth-input"
                />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                />
                <button className="auth-button" onClick={handleLogin}>
                    Giriş Yap
                </button>
                {error && <p className="auth-error">{error}</p>}
                <p>
                    Henüz hesabın yok mu? <Link to="/register">Kayıt ol</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
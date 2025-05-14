import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await axios.post('https://localhost:7264/api/user/register', {
                username,
                password,
            });

            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (err: any) {
            if (err.response) {
                if (err.response.status === 400 && err.response.data === "Username already exists") {
                    setError("Bu kullanıcı adı zaten alınmış.");
                } else {
                    setError(err.response.data || "Kayıt sırasında bir hata oluştu.");
                }
            } else {
                setError("Sunucuya ulaşılamıyor.");
            }
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2>Kayıt Ol</h2>
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
                <button className="auth-button" onClick={handleRegister}>
                    Kayıt Ol
                </button>
                {error && <p className="auth-error">{error}</p>}
                <p>
                    Zaten bir hesabın var mı? <Link to="/">Giriş yap</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://localhost:7264/api/user/login', {
                userName: username,  // Backend'teki UserDto'da `userName` kullanılıyor
                password,
            });

            // Token'ı localStorage'a kaydet
            localStorage.setItem('token', response.data.token);

            // Giriş başarılı, ana sayfaya yönlendir
            navigate('/home');
        } catch (err: any) {
            if (err.response) {
                if (err.response.status === 401) {
                    setError(err.response.data || "Böyle bir kullanıcı yok veya şifre yanlış.");
                } else {
                    setError(err.response.data || "Giriş sırasında bir hata oluştu.");
                }
            } else {
                setError("Sunucuya ulaşılamıyor.");
            }
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2>Giriş Yap</h2>
            <input
                type="text"
                placeholder="Kullanıcı Adı"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ padding: '10px', width: '200px', borderRadius: '4px' }}
            /><br /><br />
            <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '10px', width: '200px', borderRadius: '4px' }}
            /><br /><br />
            <button
                style={{
                    backgroundColor: 'green',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
                onClick={handleLogin}
            >
                Giriş Yap
            </button><br /><br />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>
                Henüz hesabın yok mu? <Link to="/register">Kayıt ol</Link>
            </p>
        </div>
    );
};

export default Login;

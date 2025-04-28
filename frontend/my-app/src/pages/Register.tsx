import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

            // Kayıt başarılı olduğunda token alıp localStorage'a kaydet
            localStorage.setItem('token', response.data.token);

            // Kayıt başarılı, login sayfasına yönlendir
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
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2>Kayıt Ol</h2>
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
                onClick={handleRegister}
            >
                Kayıt Ol
            </button><br /><br />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>
                Zaten bir hesabın var mı? <Link to="/">Giriş yap</Link>
            </p>
        </div>
    );
};

export default Register;
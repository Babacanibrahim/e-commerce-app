import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Navigate için ekledik

const Home = () => {
    const [username, setUsername] = useState<string>('');
    const navigate = useNavigate(); // Yönlendirme için

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Hoşgeldin {username}</h1>
            <button
                onClick={handleLogout}
                style={{
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '20px'
                }}
            >
                Çıkış Yap
            </button>
        </div>
    );
};

export default Home;
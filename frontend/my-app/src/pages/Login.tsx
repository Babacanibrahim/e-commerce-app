import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2>Giriş Yap</h2>
            <input type="text" placeholder="Kullanıcı Adı" /><br /><br />
            <input type="password" placeholder="Şifre" /><br /><br />
            <button style={{ backgroundColor: 'green', color: 'white', padding: '8px 16px' }}>
                Giriş Yap
            </button><br /><br />
            <p>
                Hesabınız yok mu? <Link to="/register">Yeni hesap oluştur</Link>
            </p>
        </div>
    );
};

export default Login;

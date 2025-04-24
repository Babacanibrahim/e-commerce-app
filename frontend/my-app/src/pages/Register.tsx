import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2>Kayıt Ol</h2>
            <input type="text" placeholder="Kullanıcı Adı" /><br /><br />
            <input type="password" placeholder="Şifre" /><br /><br />
            <button style={{ backgroundColor: 'green', color: 'white', padding: '8px 16px' }}>
                Kayıt Ol
            </button><br /><br />
            <p>
                Zaten bir hesabın var mı? <Link to="/">Giriş yap</Link>
            </p>
        </div>
    );
};

export default Register;

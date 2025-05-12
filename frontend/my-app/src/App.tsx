import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import CartPage from './pages/CartPage';
import Admin from './pages/Admin';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/home"
                    element={<PrivateRoute element={<Home />} />}
                />
                <Route
                    path="/admin"
                    element={<PrivateRoute element={<Admin />} />}
                />
                <Route path="/cart" element={<CartPage />} />
            </Routes>
        </Router>
    );
};

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* PrivateRoute'ı Route ile sarmalıyoruz */}
                <Route
                    path="/home"
                    element={
                        <PrivateRoute element={<Home />} />
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;

import { Navigate } from 'react-router-dom';
import { FC, ReactElement } from 'react'; // JSX.Element yerine ReactElement kullanmak daha doğru

interface PrivateRouteProps {
    element: ReactElement;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ element }) => {
    const isAuthenticated = localStorage.getItem('token'); // Token kontrolü

    if (!isAuthenticated) {
        return <Navigate to="/" replace />; // replace: geri tuşunda login'e dönmeyi engeller
    }

    return element;
};

export default PrivateRoute;

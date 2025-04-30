import { useLocation } from 'react-router-dom';
import { Product } from '../types/Product';
import Cart from '../components/Cart';

const CartPage = () => {
    const location = useLocation();
    const cartItems: Product[] = location.state?.cartItems || [];

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Sepetim</h1>
            <Cart
                cartItems={cartItems}
                onRemoveFromCart={() => { }}
                onUpdateQuantity={() => { }}
            />
        </div>
    );
};

export default CartPage;

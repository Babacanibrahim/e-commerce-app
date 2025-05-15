import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types/CartItem';
import Cart from '../components/Cart';

const CartPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const handleRemoveFromCart = (id: number) => {
        const updated = cartItems.filter(item => item.id !== id);
        setCartItems(updated);
    };

    const handleUpdateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) return; // negatif ve 0 miktar engelleme
        const updated = cartItems.map(item =>
            item.id === id ? { ...item, quantity } : item
        );
        setCartItems(updated);
    };

    const handleGoBack = () => {
        navigate('/home');
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Sepetim</h1>
            <Cart
                cartItems={cartItems}
                onRemoveFromCart={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateQuantity}
            />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                    onClick={handleGoBack}
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    🛍️ Mağazaya Geri Dön
                </button>
            </div>
        </div>
    );
};

export default CartPage;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types/CartItem';
import Cart from '../components/Cart';
import axios from 'axios';

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
        if (quantity < 1) return;
        const updated = cartItems.map(item =>
            item.id === id ? { ...item, quantity } : item
        );
        setCartItems(updated);
    };

    const handleGoBack = () => {
        navigate('/home');
    };

    const handleOrderSubmit = async () => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        try {
            await axios.post('https://localhost:7264/api/Order', {
                username: username,
                orderItems: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert('Sipariş başarıyla oluşturuldu!');
            setCartItems([]);
            localStorage.removeItem('cartItems');
            navigate('/home');
        } catch (error) {
            console.error('Sipariş oluşturulamadı:', error);
            alert('Sipariş sırasında bir hata oluştu.');
        }
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
                    onClick={handleOrderSubmit}
                    style={{
                        backgroundColor: 'green',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginBottom: '10px'
                    }}
                >
                    ✅ Siparişi Tamamla
                </button>
                <br />
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
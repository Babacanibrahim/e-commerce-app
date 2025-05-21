import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types/CartItem';
import Cart from '../components/Cart';
import axios from 'axios';

const CartPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // localStorage'dan sepeti yükle
    useEffect(() => {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    // Sepet değişince localStorage'ı güncelle
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Sepetten ürün çıkar
    const handleRemoveFromCart = (id: number) => {
        const updated = cartItems.filter(item => item.id !== id);
        setCartItems(updated);
    };

    // Miktarı güncelle
    const handleUpdateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) return;
        const updated = cartItems.map(item =>
            item.id === id ? { ...item, quantity } : item
        );
        setCartItems(updated);
    };

    // Mağazaya geri dön
    const handleGoBack = () => {
        navigate('/home');
    };

    // Siparişi gönder
    const handleOrderSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Giriş yapmanız gerekiyor.");
            return;
        }

        try {
            await axios.post('https://localhost:7264/api/Order', {
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert('✅ Sipariş başarıyla oluşturuldu!');
            setCartItems([]);
            localStorage.removeItem('cartItems');
            navigate('/home');
        } catch (error) {
            console.error('Sipariş oluşturulamadı:', error);
            alert('🚫 Sipariş sırasında bir hata oluştu.');
        }
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>🛒 Sepetim</h1>
            <Cart
                cartItems={cartItems}
                onRemoveFromCart={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateQuantity}
            />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                    onClick={handleOrderSubmit}
                    disabled={cartItems.length === 0}
                    style={{
                        backgroundColor: cartItems.length === 0 ? 'gray' : 'green',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer',
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
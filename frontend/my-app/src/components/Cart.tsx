import { Product } from '../types/Product';

interface CartProps {
    cartItems: Product[];
    onRemoveFromCart: (id: number) => void;
    onUpdateQuantity: (id: number, quantity: number) => void;
}

const Cart = ({ cartItems, onRemoveFromCart, onUpdateQuantity }: CartProps) => {
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.stock, 0);
    };

    const handleQuantityChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const quantity = parseInt(e.target.value);
        if (quantity >= 1) {
            onUpdateQuantity(id, quantity);
        }
    };

    return (
        <div style={{ margin: '50px auto', maxWidth: '800px' }}>
            <h2>Sepetiniz</h2>
            {cartItems.length === 0 ? (
                <p>Sepetiniz boş.</p>
            ) : (
                <div>
                    {cartItems.map((product) => (
                        <div key={product.id} style={{ display: 'flex', marginBottom: '20px' }}>
                            <img
                                src={`/images/${product.imageUrl}`}
                                alt={product.name}
                                style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '20px' }}
                            />
                            <div style={{ flex: 1 }}>
                                <h3>{product.name}</h3>
                                <p>Fiyat: ${product.price}</p>
                                <p>Stok: {product.stock}</p>
                                <input
                                    type="number"
                                    value={product.stock}
                                    onChange={(e) => handleQuantityChange(product.id, e)}
                                    style={{ width: '50px', padding: '5px', marginRight: '10px' }}
                                />
                                <button
                                    onClick={() => onRemoveFromCart(product.id)}
                                    style={{
                                        backgroundColor: 'red',
                                        color: 'white',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Sepetten Çıkar
                                </button>
                            </div>
                        </div>
                    ))}
                    <div style={{ textAlign: 'right' }}>
                        <h3>Toplam: ${calculateTotal().toFixed(2)}</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
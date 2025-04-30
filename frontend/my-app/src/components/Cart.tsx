import { Product } from '../types/Product';

interface CartProps {
    cartItems: Product[];
    onRemoveFromCart: (id: number) => void;
}

const Cart = ({ cartItems, onRemoveFromCart }: CartProps) => {
    return (
        <div style={{ marginTop: '40px' }}>
            <h2>Sepet</h2>
            {cartItems.length === 0 ? (
                <p>Sepet boş.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {cartItems.map((item) => (
                        <li
                            key={item.id}
                            style={{
                                border: '1px solid #ccc',
                                padding: '10px',
                                marginBottom: '10px',
                                borderRadius: '5px',
                            }}
                        >
                            <strong>{item.name}</strong> - ${item.price}
                            <button
                                onClick={() => onRemoveFromCart(item.id)}
                                style={{
                                    marginLeft: '20px',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    border: 'none',
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                Kaldır
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Cart;
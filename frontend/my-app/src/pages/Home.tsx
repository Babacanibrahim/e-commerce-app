import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import { Product } from '../types/Product';

const sampleProducts: Product[] = [
    {
        id: 1,
        name: "iPhone 13",
        price: 1299.99,
        stock: 25,
        imageUrl: "iphone13.jpg",
    },
    {
        id: 2,
        name: "Samsung Galaxy S21",
        price: 999.99,
        stock: 18,
        imageUrl: "galaxys21.jpg",
    },
    {
        id: 3,
        name: "MacBook Pro 16",
        price: 2399.99,
        stock: 15,
        imageUrl: "macbookpro16.jpg",
    },
];

const Home = () => {
    const [username, setUsername] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
        setProducts(sampleProducts);
    }, []);

    useEffect(() => {
        setFilteredProducts(
            products.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, products]);

    const handleAddToCart = (product: Product) => {
        if (!cartItems.find((item) => item.id === product.id)) {
            setCartItems([...cartItems, { ...product, stock: 1 }]);
        }
    };

    const handleRemoveFromCart = (id: number) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    };

    const handleUpdateQuantity = (id: number, quantity: number) => {
        setCartItems(
            cartItems.map((item) =>
                item.id === id ? { ...item, stock: quantity } : item
            )
        );
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', position: 'relative' }}>
            {/* Sepet ikonu sağ üst */}
            <div style={{ position: 'absolute', top: 20, right: 20, textAlign: 'center' }}>
                <Link to="/cart" state={{ cartItems }} style={{ textDecoration: 'none', color: 'black' }}>
                    <div style={{ fontSize: '24px' }}>🛒</div>
                    <div>Sepetim</div>
                </Link>
            </div>

            <h1>Hoşgeldin {username}</h1>

            <button
                onClick={handleLogout}
                style={{
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '20px',
                }}
            >
                Çıkış Yap
            </button>

            <div>
                <input
                    type="text"
                    placeholder="Ürün ara"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                        padding: '10px',
                        width: '300px',
                        borderRadius: '4px',
                        marginBottom: '20px',
                    }}
                />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
            </div>

            <Cart
                cartItems={cartItems}
                onRemoveFromCart={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateQuantity}
            />
        </div>
    );
};

export default Home;
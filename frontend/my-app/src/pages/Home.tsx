import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { CartItem } from '../types/CartItem';
import { Product } from '../types/Product'; // Product tipi hâlâ ürün verisi için kullanılacak

const Home = () => {
    const [username, setUsername] = useState<string>('');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const role = localStorage.getItem('role');
        const storedCart = localStorage.getItem('cartItems');

        if (role === 'admin') {
            navigate('/admin');
            return;
        }

        if (storedUsername) {
            setUsername(storedUsername);
        }

        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }

        const token = localStorage.getItem('token');

        axios.get('https://localhost:7264/api/Product', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error('Ürün verileri alınamadı:', error);
            });
    }, [navigate]);

    useEffect(() => {
        setFilteredProducts(
            products.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, products]);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const handleAddToCart = (product: Product) => {
        const existingItem = cartItems.find((item) => item.id === product.id);
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                setCartItems(cartItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ));
            } else {
                alert("Stok yetersiz!");
            }
        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }]);
        }
    };


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('cartItems');
        navigate('/');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 20, right: 20 }}>
                <Link to="/cart" style={{ textDecoration: 'none', color: 'black' }} state={{ cartItems }}>
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
        </div>
    );
};

export default Home;

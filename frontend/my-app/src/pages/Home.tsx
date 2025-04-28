import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Deneme amaçlı ürünler
const sampleProducts = [
    {
        id: 1,
        name: "iPhone 13",
        price: 1299.99,
        stock: 25,
        imageUrl: "/images/iphone13.jpg",
    },
    {
        id: 2,
        name: "Samsung Galaxy S21",
        price: 999.99,
        stock: 18,
        imageUrl: "/images/galaxys21.jpg",
    },
    {
        id: 3,
        name: "MacBook Pro 16",
        price: 2399.99,
        stock: 15,
        imageUrl: "/images/macbookpro16.jpg",
    },
];

const Home = () => {
    const [username, setUsername] = useState<string>('');
    const [products, setProducts] = useState<any[]>([]); // Ürünlerin state'i
    const [searchTerm, setSearchTerm] = useState<string>(''); // Arama için
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]); // Filtrelenmiş ürünler
    const navigate = useNavigate(); // Yönlendirme için

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }

        // Ürünleri yükle
        setProducts(sampleProducts);
    }, []);

    useEffect(() => {
        // Arama filtreleme işlemi
        setFilteredProducts(
            products.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, products]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/'); // Çıkış yapınca login sayfasına yönlendir
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Hoşgeldin {username}</h1>

            <button
                onClick={handleLogout}
                style={{
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '20px'
                }}
            >
                Çıkış Yap
            </button>

            <div>
                {/* Arama çubuğu */}
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
                {/* Ürünleri listele */}
                {filteredProducts.map((product) => (
                    <div key={product.id} style={{ margin: '20px', width: '250px' }}>
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                            }}
                        />
                        <h3>{product.name}</h3>
                        <p>Fiyat: ${product.price}</p>
                        <p>Stok: {product.stock}</p>
                        <button
                            style={{
                                backgroundColor: 'green',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Sepete Ekle
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Admin.css';

const Admin = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: 0,
        stock: 0,
        category: '',
    });
    const [newCategory, setNewCategory] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editProductId, setEditProductId] = useState<number | null>(null);

    const [editCategoryMode, setEditCategoryMode] = useState(false);
    const [editCategoryId, setEditCategoryId] = useState<number | null>(null);


    const token = localStorage.getItem('token');

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== '0') {
            navigate('/home');
        }

        fetchProducts();
        fetchCategories();
        fetchOrders();
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://localhost:7264/api/Product', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts(response.data);
        } catch (error) {
            console.error('fetchProducts error:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://localhost:7264/api/Category', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(response.data);
        } catch (error) {
            console.error('fetchCategories error:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get('https://localhost:7264/api/Order/all', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOrders(response.data);
        } catch (error) {
            console.error('fetchOrders error:', error);
        }
    };

    const handleProductSubmit = async () => {
        if (newProduct.category === '') {
            alert('Kategori seçilmelidir');
            return;
        }

        try {
            if (editMode && editProductId !== null) {
                await axios.put(`https://localhost:7264/api/Product/${editProductId}`, newProduct, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                await axios.post('https://localhost:7264/api/Product', newProduct, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            fetchProducts();
            setNewProduct({ name: '', price: 0, stock: 0, category: '' });
            setEditMode(false);
            setEditProductId(null);
        } catch (error) {
            console.error('handleProductSubmit error:', error);
        }
    };


    const handleCategorySubmit = async () => {
        try {
            if (editCategoryMode && editCategoryId !== null) {
                await axios.put(`https://localhost:7264/api/Category/${editCategoryId}`, { name: newCategory }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                await axios.post('https://localhost:7264/api/Category', { name: newCategory }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            fetchCategories();
            setNewCategory('');
            setEditCategoryMode(false);
            setEditCategoryId(null);
        } catch (error) {
            console.error('handleCategorySubmit error:', error);
        }
    };


    const handleProductEdit = (product: any) => {
        setNewProduct({
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: product.category,
        });
        setEditProductId(product.id);
        setEditMode(true);
    };


    const handleProductDelete = async (productId: number) => {
        try {
            await axios.delete(`https://localhost:7264/api/Product/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchProducts();
        } catch (error) {
            console.error('handleProductDelete error:', error);
        }
    };

    const handleCategoryEdit = (category: any) => {
        setNewCategory(category.name);
        setEditCategoryMode(true);
        setEditCategoryId(category.id);
    };


    const handleCategoryDelete = async (categoryId: number) => {
        try {
            await axios.delete(`https://localhost:7264/api/Category/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchCategories();
        } catch (error) {
            console.error('handleCategoryDelete error:', error);
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* Sol Panel */}
            <div className="admin-panel">
                <h2>Admin Panel</h2>
                <p>Hoşgeldiniz!</p>
                <p>İşlemler:</p>
                <ul>
                    <li>Ürün Ekle</li>
                    <li>Kategori Ekle</li>
                    <li>Ürün Listesi</li>
                    <li>Kategori Listesi</li>
                    <li>Siparişler</li>
                </ul>
            </div>

            {/* Sağ İçerik Paneli */}
            <div className="main-content">
                <h1>Admin Paneline Hoşgeldiniz</h1>

                {/* Ürün Ekleme */}
                <div className="card">
                    <h2>Ürün Ekle</h2>
                    <input
                        type="text"
                        placeholder="Ürün Adı"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Fiyat"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: +e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Stok"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: +e.target.value })}
                    />
                    <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    >
                        <option value="">Kategori Seç</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleProductSubmit}>Ürün Ekle</button>
                </div>

                {/* Kategori Ekleme */}
                <div className="card">
                    <h2>Kategori Ekle</h2>
                    <input
                        type="text"
                        placeholder="Kategori Adı"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button onClick={handleCategorySubmit}>Kategori Ekle</button>
                </div>

                {/* Ürün Listeleme */}
                <div>
                    <h2>Ürünler</h2>
                    <ul>
                        {products.map((product) => (
                            <li key={product.id} className="list-item">
                                {product.name} - {product.price} TL - Stok: {product.stock}
                                <button onClick={() => handleProductEdit(product)}>Düzenle</button>
                                <button onClick={() => handleProductDelete(product.id)}>Sil</button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Kategori Listeleme */}
                <div>
                    <h2>Kategoriler</h2>
                    <ul>
                        {categories.map((category) => (
                            <li key={category.id} className="list-item">
                                {category.name}
                                <button onClick={() => handleCategoryEdit(category)}>Düzenle</button>
                                <button onClick={() => handleCategoryDelete(category.id)}>Sil</button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Siparişler */}
                <div>
                    <h2>Siparişler</h2>
                    <ul>
                        {orders.map((order, index) => (
                            <li key={index} className="list-item">
                                Kullanıcı: {order.userName} <br />
                                Ürünler: {order.productNames.join(', ')}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Admin;
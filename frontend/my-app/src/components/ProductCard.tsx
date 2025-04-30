import { Product } from '../types/Product';

interface Props {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: Props) => {
    return (
        <div style={{ margin: '20px', width: '250px' }}>
            <img
                src={`/images/${product.imageUrl}`}
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
                onClick={() => onAddToCart(product)}
            >
                Sepete Ekle
            </button>
        </div>
    );
};

export default ProductCard;

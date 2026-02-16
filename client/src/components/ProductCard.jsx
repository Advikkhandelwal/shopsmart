import React from 'react';

const ProductCard = ({ product, onClick, onAddToCart }) => {
    return (
        <div className="product-card" onClick={() => onClick(product.id)}>
            <div className="product-image-wrapper">
                <img
                    src={product.imageUrl || 'https://placehold.co/400?text=No+image'}
                    alt={product.name}
                    className="product-image"
                />
            </div>
            <h3 className="product-title">{product.name}</h3>
            <div className="product-price">
                <small>$</small>{Number(product.price).toFixed(2)}
            </div>
            <button
                className="btn-add-cart"
                onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product.id);
                }}
            >
                Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;

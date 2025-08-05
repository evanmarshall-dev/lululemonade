import PropTypes from "prop-types";
import { useCart } from "../../context/CartContext";
import "./Product.css";

const Product = (product) => {
  const { name, price, description, imageUrl } = product;
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img src={imageUrl} alt={name} className="product-image" />
      <div className="product-info">
        <h2 className="product-name">{name}</h2>
        <p className="product-price">${price.toFixed(2)}</p>
        <p className="product-description">{description}</p>
        <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

Product.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default Product;

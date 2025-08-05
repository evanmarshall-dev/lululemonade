import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Header.css";

const Header = () => {
  const { getCartItemCount } = useCart();

  return (
    <header className="app-header">
      <Link to="/" className="logo">
        Lululemonade
      </Link>
      <Link to="/cart" className="cart-status">
        Cart: {getCartItemCount()}
      </Link>
    </header>
  );
};

export default Header;

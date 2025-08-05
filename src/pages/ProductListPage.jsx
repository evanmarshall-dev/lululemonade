import Product from "../components/Product/Product";
import { products } from "../data/products";
import "./ProductListPage.css";

function ProductListPage() {
  return (
    <div className="product-list-page">
      <h1>Our Products</h1>
      <div className="product-container">
        {products.map((product) => (
          <Product key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}

export default ProductListPage;

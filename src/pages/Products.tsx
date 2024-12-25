import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.tsx';

interface Product {
  _id: string;
  name: string;
  price: number;
  img: string;
  category: string;
  productId: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category');
  const { isLoggedIn } = useAuth();

  console.log('Category:', category);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get-product');
        if (response.data.success) {
          let filteredProducts = response.data.products;
          if (category) {
            filteredProducts = filteredProducts.filter((product: Product) => 
              product.category && product.category.toLowerCase() === category.toLowerCase()
            );
          }
          setProducts(filteredProducts);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const addToCart = async (productId: string) => {
    try {
      if (!isLoggedIn) {
        navigate('/login');
        return;
      }
      const userId = localStorage.getItem('userId');
      const response = await axios.post(
        'http://localhost:5000/cart/addtocart',
        { userId, productId, quantity: 1 },
        { withCredentials: true }
      );
      if (response.data.success) {
        alert('Product added to cart successfully!');
      } else {
        alert(response.data.message || 'Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/login');
      } else {
        alert('Error adding product to cart');
      }
    }
  };

  if (loading) {
    return <div className="text-center text-2xl text-gray-600">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-8">
        Our Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
            <img 
              src={product.img || `https://source.unsplash.com/600x400/?${product.category},clothing`} 
              alt={product.name} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.category}</p>
              <p className="text-pink-600 font-bold mb-4">₹{(Number(product.price) || 0).toFixed(2)}</p>
              <button 
                onClick={() => addToCart(product.productId)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full hover:from-pink-600 hover:to-purple-600 transition duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;


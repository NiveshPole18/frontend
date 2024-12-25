import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.tsx';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItem {
  _id: string;
  productId: string;
  productQty: number;
  product?: {
    name: string;
    price: number;
    img: string;
  };
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      fetchCart();
    }
  }, [isLoggedIn, navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }
      const response = await axios.post('http://localhost:5000/cart/get-cart', { userId }, { withCredentials: true });
      console.log('Cart response:', response.data);
      if (response.data.success) {
        if (!response.data.cart || !response.data.cart.productsInCart) {
          setCartItems([]);
        } else {
          const itemsWithDetails = await Promise.all(response.data.cart.productsInCart.map(async (item: CartItem) => {
            const productResponse = await axios.get(`http://localhost:5000/cart/product/${item.productId}`);
            return { ...item, product: productResponse.data.product };
          }));
          console.log('Cart items with details:', itemsWithDetails);
          setCartItems(itemsWithDetails);
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.put('http://localhost:5000/cart/update-quantity', 
        { userId, productId, productQty: newQuantity },
        { withCredentials: true }
      );
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Failed to update quantity. Please try again.');
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.post('http://localhost:5000/cart/delete-items', 
        { userId, productId },
        { withCredentials: true }
      );
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Failed to remove item. Please try again.');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product?.price || 0) * item.productQty, 0);
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      setError(null);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      // Validate all required fields
      if (!name.trim() || !email.trim() || !address.trim() || cartItems.length === 0) {
        setError('Please fill in all required fields and ensure your cart is not empty.');
        return;
      }

      const items = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.productQty
      }));

      const orderData = {
        userId,
        name: name.trim(),
        email: email.trim(),
        items,
        price: calculateTotal(),
        address: address.trim()
      };

      console.log('Sending order data:', orderData);

      const response = await axios.post('http://localhost:5000/cart/place-order', orderData, { withCredentials: true });

      console.log('Order response:', response.data);

      if (response.data.success) {
        alert(`Order placed successfully! Your order ID is ${response.data.order.orderId}`);
        setCartItems([]);
        setName('');
        setEmail('');
        setAddress('');
      } else {
        throw new Error(response.data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      if (axios.isAxiosError(error) && error.response) {
        setError(`Checkout failed: ${error.response.data.message || error.message}`);
        console.error('Full error response:', error.response.data);
      } else {
        setError('An unexpected error occurred during checkout. Please try again.');
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading your cart...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchCart} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full" src={item.product?.img || '/placeholder.svg'} alt={item.product?.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.product?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button onClick={() => updateQuantity(item.productId, Math.max(1, item.productQty - 1))} className="text-gray-500 hover:text-gray-700">
                          <Minus size={16} />
                        </button>
                        <span className="mx-2">{item.productQty}</span>
                        <button onClick={() => updateQuantity(item.productId, item.productQty + 1)} className="text-gray-500 hover:text-gray-700">
                          <Plus size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{((item.product?.price || 0) * item.productQty).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => removeItem(item.productId)} className="text-red-600 hover:text-red-900">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Delivery Address</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter your delivery address"
              rows={3}
              required
            ></textarea>
          </div>
          <div className="mt-8 flex justify-between items-center">
            <div className="text-2xl font-bold">Total: ₹{calculateTotal().toFixed(2)}</div>
            <button 
              onClick={handleCheckout}
              disabled={checkoutLoading || !name.trim() || !email.trim() || !address.trim() || cartItems.length === 0}
              className={`bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded ${(checkoutLoading || !name.trim() || !email.trim() || !address.trim() || cartItems.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {checkoutLoading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;


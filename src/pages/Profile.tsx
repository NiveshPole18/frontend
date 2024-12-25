import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  productId: string;
  quantity: number;
}

interface Order {
  orderId: string;
  items: OrderItem[];
}

const Profile: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [isLoggedIn, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const orderId = localStorage.getItem('orderId');
      if (!orderId) {
        throw new Error('Order ID not found. Please place an order first.');
      }
      const response = await axios.get(`https://projectbackend-14ei.onrender.com/orders/order/${orderId}`, { withCredentials: true });
      console.log('API Response:', response.data); // For debugging
      if (response.data.success) {
        setOrders([response.data.order]);
      } else {
        throw new Error(response.data.message || 'Failed to fetch order or invalid data received');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (axios.isAxiosError(error) && error.response) {
        setError(`Failed to load orders: ${error.response.data.message || error.message}`);
      } else {
        setError('Failed to load orders. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-xl">Loading your orders...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4 text-xl">{error}</p>
        <button 
          onClick={fetchOrders} 
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-center text-xl text-gray-600">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.orderId} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
              <h2 className="text-2xl font-semibold text-pink-600 mb-4">Order #{order.orderId}</h2>
              <ul className="list-disc list-inside">
                {order.items.map((item, index) => (
                  <li key={index} className="mb-2">
                    Product ID: {item.productId}, Quantity: {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;


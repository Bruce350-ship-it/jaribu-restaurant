import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { router } from 'expo-router';
import { Package, Clock, CircleCheck as CheckCircle, Circle as XCircle, Truck } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Order, OrderItem } from '../../types';
import axiosClient from '../../api/axiosClient';

export default function WebOrdersScreen() {
  const { requireAuth } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth()) return;
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosClient.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={24} color="#f59e0b" />;
      case 'preparing':
        return <Package size={24} color="#3b82f6" />;
      case 'ready':
        return <CheckCircle size={24} color="#10b981" />;
      case 'delivered':
        return <Truck size={24} color="#10b981" />;
      case 'cancelled':
        return <XCircle size={24} color="#ef4444" />;
      default:
        return <Clock size={24} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'preparing':
        return 'text-blue-600 bg-blue-50';
      case 'ready':
        return 'text-green-600 bg-green-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-warm-600">Loading orders...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 overflow-y-auto px-20 py-8">
      <Text className="text-3xl font-bold text-warm-900 mb-8">Order History</Text>

      {orders.length === 0 ? (
        <View className="bg-white rounded-xl p-12 border border-warm-200 text-center">
          <Package size={80} color="#d1d5db" className="mx-auto mb-6" />
          <Text className="text-xl font-semibold text-warm-900 mb-4">No orders yet</Text>
          <Text className="text-warm-600 mb-6">
            Your order history will appear here once you place your first order.
          </Text>
          <Button
            title="Browse Menu"
            onPress={() => router.push('/(web)')}
          />
        </View>
      ) : (
        <View className="space-y-4">
          {orders.map((order) => (
            <View key={order.id} className="bg-white rounded-xl p-6 border border-warm-200 hover:shadow-md transition-shadow">
              <View className="flex-row justify-between items-start mb-4">
                <View>
                  <Text className="text-xl font-semibold text-warm-900 mb-1">
                    Order #{order.id/*.slice(-8)*/}
                  </Text>
                  <Text className="text-warm-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </Text>
                </View>
                <View className={`flex-row items-center px-3 py-2 rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <Text className={`ml-2 font-medium ${getStatusColor(order.status).split(' ')[0]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Text>
                </View>
              </View>

              {/* Order Items */}
              <View className="bg-warm-50 rounded-lg p-4 mb-4">
                <Text className="font-semibold text-warm-900 mb-3">Order Items</Text>
                <View className="space-y-2">
                  {order.OrderItems.map((item, index) => (
                    <View key={index} className="flex-row justify-between items-center">
                      <Text className="text-warm-700">
                        {item.quantity}x {item.MenuItem.name}
                      </Text>
                      <Text className="text-warm-900 font-medium">
                        ${(item.MenuItem.price * item.quantity)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Delivery Info */}
              {order.deliveryAddress && (
                <View className="mb-4">
                  <Text className="font-semibold text-warm-900 mb-2">Delivery Address</Text>
                  <Text className="text-warm-700">{order.deliveryAddress}</Text>
                  {order.customerNotes && (
                    <View className="mt-2">
                      <Text className="font-medium text-warm-700">Notes:</Text>
                      <Text className="text-warm-600">{order.customerNotes}</Text>
                    </View>
                  )}
                </View>
              )}

              <View className="flex-row justify-between items-center">
                <Text className="text-warm-600">
                  {order.OrderItems.reduce((sum, item) => sum + item.quantity, 0)} items total
                </Text>
                <Text className="text-2xl font-bold text-primary-500">
                  ${order.totalAmount}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
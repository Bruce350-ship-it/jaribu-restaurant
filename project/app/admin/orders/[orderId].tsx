import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '../../../contexts/AuthContext';
import { Order } from '../../../types';
import Button from '../../../components/Button';
import axiosClient from '../../../api/axiosClient';

export default function OrderDetailScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { user, requireAuth } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!requireAuth() || user?.role !== 'admin') {
      router.replace('/');
      return;
    }
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, user]);

  const fetchOrder = async () => {
    try {
      const response = await axiosClient.get(`/api/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (status: Order['status']) => {
    if (!order) return;

    setUpdating(true);
    try {
      await axiosClient.put(`/api/orders/${order.id}/status`, { status });
      setOrder({ ...order, status });
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-warm-50">
        <Text className="text-warm-600">Loading order...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 justify-center items-center bg-warm-50">
        <Text className="text-warm-600">Order not found</Text>
      </View>
    );
  }

  const statusButtons = [
    { status: 'pending' as const, title: 'Pending', color: 'bg-yellow-500' },
    { status: 'preparing' as const, title: 'Preparing', color: 'bg-blue-500' },
    { status: 'ready' as const, title: 'Ready', color: 'bg-green-500' },
    { status: 'delivered' as const, title: 'Delivered', color: 'bg-green-600' },
    { status: 'cancelled' as const, title: 'Cancelled', color: 'bg-red-500' },
  ];

  return (
    <View className="flex-1 bg-warm-50">
      <View className="bg-white p-4 border-b border-warm-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold mb-4 text-warm-900">Order #{order.id}</Text>
          <TouchableOpacity onPress={() => router.replace('/admin')}>
            <Text className="text-lg font-bold mb-4">Done</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Order Info */}
        <View className="bg-white rounded-lg p-4 mb-4 border border-warm-200">
          <Text className="text-lg font-semibold text-warm-900 mb-3">Order Information</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-warm-600">Order Date:</Text>
              <Text className="text-warm-900">
                {new Date(order.createdAt).toLocaleString()}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-warm-600">Status:</Text>
              <Text className={`font-semibold ${
                order.status === 'pending' ? 'text-yellow-600' :
                order.status === 'preparing' ? 'text-blue-600' :
                order.status === 'delivered' ? 'text-green-600' :
                'text-red-600'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-warm-600">Total:</Text>
              <Text className="text-lg font-bold text-primary-500">
                UgX. {order.totalAmount}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View className="bg-white rounded-lg p-4 mb-4 border border-warm-200">
          <Text className="text-lg font-semibold text-warm-900 mb-3">Order Items</Text>
          {order.OrderItems.map((item, index) => (
            <View key={index} className="flex-row justify-between items-center py-2 border-b border-warm-100 last:border-b-0">
              <View className="flex-1">
                <Text className="text-warm-900 font-medium">{item.MenuItem.name}</Text>
                <Text className="text-warm-600">Qty: {item.quantity}</Text>
                {item.specialInstructions && (
                  <Text className="text-warm-500 text-sm">Note: {item.specialInstructions}</Text>
                )}
              </View>
              <Text className="text-warm-900 font-semibold">
                UgX. {(item.MenuItem.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        {/* Delivery Information */}
        {order.deliveryAddress && (
          <View className="bg-white rounded-lg p-4 mb-4 border border-warm-200">
            <Text className="text-lg font-semibold text-warm-900 mb-3">Delivery Information</Text>
            <Text className="text-warm-700">{order.deliveryAddress}</Text>
            {order.customerNotes && (
              <View className="mt-2">
                <Text className="text-warm-600 font-medium">Customer Notes:</Text>
                <Text className="text-warm-700">{order.customerNotes}</Text>
              </View>
            )}
          </View>
        )}

        {/* Customer Information */}
        {order.User && (
          <View className="bg-white rounded-lg p-4 mb-4 border border-warm-200">
            <Text className="text-lg font-semibold text-warm-900 mb-3">Customer Information</Text>
            <Text className="text-warm-700">Name: {order.User.name}</Text>
            <Text className="text-warm-700">Email: {order.User.email}</Text>
            {order.User.phone && <Text className="text-warm-700">Phone: {order.User.phone}</Text>}
          </View>
        )}

        {/* Status Update */}
        <View className="bg-white rounded-lg p-4 border border-warm-200">
          <Text className="text-lg font-semibold text-warm-900 mb-3">Update Status</Text>
          <View className="flex-row flex-wrap gap-2">
            {statusButtons.map((button) => (
              <Button
                key={button.status}
                title={button.title}
                onPress={() => updateOrderStatus(button.status)}
                loading={updating}
                disabled={order.status === button.status}
                variant={order.status === button.status ? 'primary' : 'outline'}
                size="small"
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
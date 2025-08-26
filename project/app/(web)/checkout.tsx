import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Order } from '@/types';
import Button from '../../components/Button';
import axiosClient from '../../api/axiosClient';

export default function WebCheckoutScreen() {
  const { requireAuth, user } = useAuth();
  const { items, total, clearCart } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!requireAuth()) return;
    if (items.length === 0) {
      router.replace('/(web)/cart');
    }
  }, [items]);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: items.map(i => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
          specialInstructions: i.specialInstructions, // if backend supports this
        })),
        totalAmount: total,
        deliveryAddress: deliveryAddress.trim(),
        customerNotes: customerNotes.trim() || undefined,
      };

      await axiosClient.post('/api/orders', orderData);

      clearCart();
      router.replace('/success');
    } catch (error) {
      console.error('Failed to place order:', error);
      Alert.alert('Order Failed', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 overflow-y-auto px-20 py-8">
      <Text className="text-3xl font-bold text-warm-900 mb-8">Checkout</Text>

      <View className="flex-row gap-8">
        {/* Order Form */}
        <View className="flex-1">
          <View className="bg-white rounded-lg p-6 border border-warm-200 mb-6">
            <Text className="text-xl font-semibold text-warm-900 mb-4">Delivery Information</Text>
            
            <View className="mb-6">
              <Text className="text-warm-700 mb-2 font-medium">Delivery Address *</Text>
              <TextInput
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                placeholder="Enter your full delivery address"
                multiline
                numberOfLines={3}
                className="border border-warm-200 rounded-lg p-4 text-warm-900 w-full"
                style={{ textAlignVertical: 'top' }}
              />
            </View>
            
            <View>
              <Text className="text-warm-700 mb-2 font-medium">Special Instructions (Optional)</Text>
              <TextInput
                value={customerNotes}
                onChangeText={setCustomerNotes}
                placeholder="Any special requests, dietary restrictions, or delivery notes..."
                multiline
                numberOfLines={3}
                className="border border-warm-200 rounded-lg p-4 text-warm-900 w-full"
                style={{ textAlignVertical: 'top' }}
              />
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View className="w-80">
          <View className="bg-white rounded-lg p-6 border border-warm-200 sticky top-4">
            <Text className="text-xl font-semibold text-warm-900 mb-4">Order Summary</Text>
            
            <ScrollView className="max-h-64 mb-4">
              {items.map((item) => (
                <View key={item.menuItem.id} className="flex-row justify-between items-start py-3 border-b border-warm-100 last:border-b-0">
                  <View className="flex-1 mr-3">
                    <Text className="text-warm-900 font-medium">{item.menuItem.name}</Text>
                    <Text className="text-warm-600 text-sm">Qty: {item.quantity}</Text>
                    {item.specialInstructions && (
                      <Text className="text-warm-500 text-xs mt-1">
                        Note: {item.specialInstructions}
                      </Text>
                    )}
                  </View>
                  <Text className="text-warm-900 font-semibold">
                    UgX. {(item.menuItem.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View className="border-t border-warm-200 pt-4 mb-6">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-warm-600">Subtotal</Text>
                <Text className="text-warm-900">UgX. {total.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-warm-600">Delivery Fee</Text>
                <Text className="text-warm-900">UgX. 3000</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-bold text-warm-900">Total</Text>
                <Text className="text-xl font-bold text-primary-500">
                  UgX. {(total + 3000).toFixed(2)}
                </Text>
              </View>
            </View>

            <Button
              title="Place Order"
              onPress={handlePlaceOrder}
              loading={loading}
              disabled={!deliveryAddress.trim()}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react-native';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';

export default function WebCartScreen() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    router.push('/(web)/checkout');
  };

  if (items.length === 0) {
    return (
      <View className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <View className="text-center">
          <ShoppingBag size={80} color="#d1d5db" />
          <Text className="text-2xl font-semibold text-warm-900 mt-6 mb-4">Your cart is empty</Text>
          <Text className="text-warm-600 mb-8 max-w-md mx-auto">
            Browse our delicious menu and add some items to get started with your order.
          </Text>
          <Button
            title="Browse Menu"
            onPress={() => router.push('/(web)')}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 overflow-y-auto px-20 py-8">
      <Text className="text-3xl font-bold text-warm-900 mb-8">Your Cart</Text>

      <View className="flex-row gap-8">
        {/* Cart Items */}
        <View className="flex-1">
          <ScrollView className="space-y-4">
            {items.map((item) => (
              <View key={item.menuItem.id} className="bg-white rounded-lg p-6 border border-warm-200">
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-1 mr-4">
                    <Text className="text-xl font-semibold text-warm-900 mb-1">
                      {item.menuItem.name}
                    </Text>
                    <Text className="text-warm-600 mb-2">UgX. {item.menuItem.price} each</Text>
                    {item.specialInstructions && (
                      <View className="bg-warm-50 p-3 rounded-lg">
                        <Text className="text-sm text-warm-600 font-medium">Special Instructions:</Text>
                        <Text className="text-sm text-warm-700">{item.specialInstructions}</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity 
                    onPress={() => removeItem(item.menuItem.id)} 
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center space-x-4">
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                      className="w-10 h-10 rounded-full bg-warm-200 items-center justify-center hover:bg-warm-300 transition-colors"
                    >
                      <Minus size={18} color="#78716c" />
                    </TouchableOpacity>
                    <Text className="text-xl font-semibold text-warm-900 w-12 text-center">
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                      className="w-10 h-10 rounded-full bg-primary-500 items-center justify-center hover:bg-primary-600 transition-colors"
                    >
                      <Plus size={18} color="white" />
                    </TouchableOpacity>
                  </View>
                  <Text className="text-xl font-bold text-primary-500">
                    UgX. {(item.menuItem.price * item.quantity)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Order Summary */}
        <View className="w-80">
          <View className="bg-white rounded-lg p-6 border border-warm-200 sticky top-4">
            <Text className="text-xl font-semibold text-warm-900 mb-4">Order Summary</Text>
            
            <View className="space-y-3 mb-6">
              {items.map((item) => (
                <View key={item.menuItem.id} className="flex-row justify-between">
                  <Text className="text-warm-700">
                    {item.quantity}x {item.menuItem.name}
                  </Text>
                  <Text className="text-warm-900 font-medium">
                    UgX. {(item.menuItem.price * item.quantity)}
                  </Text>
                </View>
              ))}
            </View>

            <View className="border-t border-warm-200 pt-4 mb-6">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-bold text-warm-900">Total</Text>
                <Text className="text-2xl font-bold text-primary-500">UgX. {total}</Text>
              </View>
            </View>

            <Button
              title={isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
              onPress={handleCheckout}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
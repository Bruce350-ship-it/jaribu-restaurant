import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { CircleCheck as CheckCircle, Clock, Truck } from 'lucide-react-native';
import Button from '../components/Button';

export default function WebSuccessScreen() {
  useEffect(() => {
    // Auto-redirect after 10 seconds on web
    const timer = setTimeout(() => {
      router.replace('/(web)');
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 overflow-y-auto px-20 py-12">
      <View className="bg-white rounded-xl p-8 border border-warm-200 text-center">
        <CheckCircle size={80} color="#10b981" className="mx-auto mb-6" />
        
        <Text className="text-3xl font-bold text-warm-900 mb-4">
          Order Placed Successfully!
        </Text>
        
        <Text className="text-lg text-warm-600 mb-8">
          Thank you for your order! We've received your request and will begin preparing 
          your delicious meal shortly.
        </Text>

        {/* Order Timeline */}
        <View className="bg-warm-50 rounded-lg p-6 mb-8">
          <Text className="text-lg font-semibold text-warm-900 mb-4">What happens next?</Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center">
              <CheckCircle size={20} color="#10b981" />
              <Text className="text-warm-700 ml-3">Order confirmed and payment processed</Text>
            </View>
            
            <View className="flex-row items-center">
              <Clock size={20} color="#f59e0b" />
              <Text className="text-warm-700 ml-3">Kitchen begins preparing your order</Text>
            </View>
            
            <View className="flex-row items-center">
              <Truck size={20} color="#6b7280" />
              <Text className="text-warm-700 ml-3">Order delivered to your address</Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-4 justify-center">
          <Button
            title="Track Order"
            onPress={() => router.push('/(web)/orders')}
            variant="outline"
          />
          <Button
            title="Continue Shopping"
            onPress={() => router.replace('/(web)')}
          />
        </View>
      </View>
    </View>
  );
}
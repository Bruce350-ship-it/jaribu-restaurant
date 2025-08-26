import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { User, Package, Calendar, LogOut, Mail, Clock } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';

export default function WebProfileScreen() {
  const { user, isAuthenticated, requireAuth, signOut } = useAuth();

  useEffect(() => {
    if (!requireAuth()) return;
  }, []);

  if (!isAuthenticated || !user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-warm-600">Please log in to view your profile</Text>
      </View>
    );
  }

  const menuItems = [
    {
      title: 'Order History',
      description: 'View your past orders and track current ones',
      icon: Package,
      onPress: () => router.push('/(web)/orders'),
    },
    {
      title: 'Catering Requests',
      description: 'Manage your catering requests and quotes',
      icon: Calendar,
      onPress: () => router.push('/(web)/catering-requests'),
    },
  ];

  return (
    <View className="flex-1 overflow-y-auto px-20 py-8">
      <Text className="text-3xl font-bold text-warm-900 mb-8">My Profile</Text>

      <View className="flex-row gap-8">
        {/* Profile Info */}
        <View className="flex-1">
          <View className="bg-white rounded-xl p-6 border border-warm-200 mb-6">
            <View className="flex-row items-center mb-6">
              <View className="w-16 h-16 bg-primary-100 rounded-full items-center justify-center mr-4">
                <User size={32} color="#f97316" />
              </View>
              <View>
                <Text className="text-2xl font-bold text-warm-900">{user.name}</Text>
                <Text className="text-warm-600">{user.role === 'admin' ? 'Administrator' : 'Customer'}</Text>
              </View>
            </View>

            <View className="space-y-3">
              <View className="flex-row items-center">
                <Mail size={16} color="#78716c" />
                <Text className="text-warm-700 ml-3">{user.email}</Text>
              </View>
              <View className="flex-row items-center">
                <Clock size={16} color="#78716c" />
                <Text className="text-warm-700 ml-3">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="bg-white rounded-xl border border-warm-200 overflow-hidden">
            <View className="p-4 border-b border-warm-200">
              <Text className="text-lg font-semibold text-warm-900">Quick Actions</Text>
            </View>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.title}
                onPress={item.onPress}
                className={`p-4 hover:bg-warm-50 transition-colors ${
                  index < menuItems.length - 1 ? 'border-b border-warm-200' : ''
                }`}
              >
                <View className="flex-row items-center">
                  <item.icon size={20} color="#78716c" />
                  <View className="ml-4 flex-1">
                    <Text className="text-warm-900 font-medium">{item.title}</Text>
                    <Text className="text-warm-600 text-sm">{item.description}</Text>
                  </View>
                  <Text className="text-warm-400">›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Actions */}
        <View className="w-80">
          <View className="bg-white rounded-xl p-6 border border-warm-200">
            <Text className="text-lg font-semibold text-warm-900 mb-4">Account</Text>
            
            <View className="space-y-3">
              <Button
                title="Sign Out"
                onPress={signOut}
                variant="outline"
              />
              
              {user.role === 'admin' && (
                <Button
                  title="Admin Dashboard"
                  onPress={() => router.push('/admin')}
                  variant="secondary"
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
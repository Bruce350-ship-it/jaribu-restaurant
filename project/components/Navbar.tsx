import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { ShoppingCart, User, LogOut } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const { isAuthenticated, user, signOut } = useAuth();
  const { itemCount } = useCart();
  const pathname = usePathname();
  
  // Only show navbar on web
  if (Platform.OS !== 'web') {
    return null;
  }

  const isActive = (path: string) => pathname === path;
  
  // Use web routes for navigation
  const getWebPath = (path: string) => {
    return path.replace('/(tabs)', '/(web)');
  };

  return (
    <View className="bg-white border-b border-warm-200 px-6 py-4 shadow-sm">
      <View className="flex-row items-center justify-between max-w-6xl mx-auto">
        {/* Logo */}
        <Link href="/(web)" className="no-underline mr-10">
          <Text className="text-2xl font-bold text-primary-500">
            Jaribu Restaurant
          </Text>
        </Link>

        {/* Navigation Links */}
        <View className="flex-row items-center space-x-8">
          <Link href="/(web)" className="no-underline">
            <Text className={`font-medium hover:text-primary-500 transition-colors ${pathname.includes('/menu') ? 'text-primary-500' : 'text-warm-700'}`}>
              Menu
            </Text>
          </Link>
          
          <Link href="/(web)/cart" className="no-underline relative">
            <View className="flex-row items-center">
              <ShoppingCart size={20} color={pathname.includes('/cart') ? '#f97316' : '#78716c'} />
              {itemCount > 0 && (
                <View className="absolute -top-2 -right-2 bg-primary-500 rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white text-xs font-bold">{itemCount}</Text>
                </View>
              )}
            </View>
          </Link>

          <Link href="/(web)/catering" className="no-underline">
            <Text className={`font-medium hover:text-primary-500 transition-colors ${pathname.includes('/catering') ? 'text-primary-500' : 'text-warm-700'}`}>
              Catering
            </Text>
          </Link>

          {/* Profile Menu */}
          {isAuthenticated ? (
            <View className="flex-row items-center space-x-6">
              <Text className="text-warm-700 hidden md:block">Hi, {user?.name}</Text>
              
              <Link href="/(web)/orders" className="no-underline">
                <Text className={`font-medium hover:text-primary-500 transition-colors ${pathname.includes('/orders') ? 'text-primary-500' : 'text-warm-700'}`}>
                  Orders
                </Text>
              </Link>
              
              <Link href="/(web)/profile" className="no-underline">
                <User size={20} color={pathname.includes('/profile') ? '#f97316' : '#78716c'} />
              </Link>
              
              <TouchableOpacity onPress={signOut} className="hover:opacity-70 transition-opacity">
                <LogOut size={20} color="#78716c" />
              </TouchableOpacity>
              
              {user?.role === 'admin' && (
                <Link href="/admin" className="no-underline">
                  <Text className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    Admin
                  </Text>
                </Link>
              )}
            </View>
          ) : (
            <Link href="/auth/login" className="no-underline">
              <Text className="font-medium text-primary-500 hover:text-primary-600 transition-colors">
                Login
              </Text>
            </Link>
          )}
        </View>
      </View>
    </View>
  );
}
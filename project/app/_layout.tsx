import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import FeedbackModal from '../components/FeedbackModal';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <StatusBar style="auto" />
        <FeedbackModal />
        <Stack screenOptions={{ headerShown: false }}>          
          <Stack.Screen name="(web)" />
          <Stack.Screen name="success" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="admin" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}
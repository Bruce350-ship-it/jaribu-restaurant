import React from 'react';
import { View } from 'react-native';
import { Slot } from 'expo-router';
import Navbar from '../../components/Navbar';

export default function WebLayout() {
  return (
    <View className="flex-1 bg-warm-50">
      <Navbar />
      <View className="flex-1">
        <Slot />
      </View>
    </View>
  );
}
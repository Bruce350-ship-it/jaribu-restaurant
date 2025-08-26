import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { MenuItem } from '../../types';
import { useCart } from '../../contexts/CartContext';
import Button from '../../components/Button';
import axiosClient from '../../api/axiosClient';

export default function WebMenuScreen() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { addItem } = useCart();

  const categories = ['All', 'Appetizers', 'Main Courses', 'Desserts', 'Beverages'];

  useEffect(() => {
    fetchMenuItems();
    console.log(menuItems);
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axiosClient.get('/api/menu');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-warm-600">Loading menu...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 overflow-y-auto px-20 py-8">
      {/* Hero Section */}
      <View className="mb-8">
        <Text className="text-4xl font-bold text-warm-900 mb-4">Our Menu</Text>
        <Text className="text-lg text-warm-600 max-w-2xl">
          Discover our carefully crafted dishes made with the finest ingredients. 
          From appetizers to desserts, every item is prepared with love and attention to detail.
        </Text>
      </View>

      {/* Category Filter */}
      <View className="mb-8">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="flex-row"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full mr-4 ${
                selectedCategory === category 
                  ? 'bg-primary-500' 
                  : 'bg-white border border-warm-200'
              }`}
            >
              <Text className={`font-medium ${
                selectedCategory === category 
                  ? 'text-white' 
                  : 'text-warm-700'
              }`}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Menu Grid */}
      <View className="flex-row flex-wrap gap-6">
        {filteredItems.map((item) => (
          <View
            key={item.id}
            className="bg-white rounded-xl shadow-sm border border-warm-200 w-80 hover:shadow-md transition-shadow overflow-hidden"
          >
            {item.image && (
              <Image
                source={{ uri: item.image }}
                className="w-full h-48"
                resizeMode="cover"
              />
            )}

            <View className="flex-1 flex-col justify-between p-6">
              <View>
                <Text className="text-xl font-semibold text-warm-900 mb-2">
                  {item.name}
                </Text>
                <Text className="text-warm-600 mb-4 leading-relaxed">
                  {item.description}
                </Text>
              </View>

              <View className="mt-auto">
                <View className="flex-row items-center justify-between">
                  <Text className="text-2xl font-bold text-primary-500">
                    UgX. {item.price}
                  </Text>
                  <Button
                    title="Add to Cart"
                    onPress={() => addItem(item)}
                    disabled={!item.available}
                    size="medium"
                  />
                </View>
                {!item.available && (
                  <Text className="text-red-500 text-sm mt-2">
                    Currently unavailable
                  </Text>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>

      {filteredItems.length === 0 && (
        <View className="text-center py-12">
          <Text className="text-warm-600">No items found in this category.</Text>
        </View>
      )}
    </View>
  );
}
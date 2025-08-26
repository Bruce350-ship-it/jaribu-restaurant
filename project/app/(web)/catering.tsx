import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Image } from 'react-native';
import { router } from 'expo-router';
import { Calendar, Users, DollarSign, Star, Clock } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import axiosClient from '../../api/axiosClient';

export default function WebCateringScreen() {
  const { isAuthenticated, requireAuth } = useAuth();
  const [eventDate, setEventDate] = useState('');
  const [time, setTime] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!requireAuth()) return;

    setLoading(true);
    try {
      await axiosClient.post('/api/catering', {
        eventDate,
        time: time.trim(),
        guestCount: parseInt(guestCount),
        location: location.trim(),
        description: description.trim(),
      });

      // Reset form
      setEventDate('');
      setTime('');
      setGuestCount('');
      setLocation('');
      setDescription('');

      router.push('/(web)/catering-requests');
    } catch (error) {
      console.error('Failed to submit catering request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 overflow-y-auto px-20 py-8">
      {/* Hero Section */}
      <View className="mb-12">
        <Text className="text-4xl font-bold text-warm-900 mb-4">Catering Services</Text>
        <Text className="text-lg text-warm-600 max-w-3xl">
          Make your next event unforgettable with our professional catering services. 
          From intimate gatherings to large celebrations, we create memorable dining experiences 
          tailored to your vision and location.
        </Text>
      </View>

      <View className="flex-row gap-12">
        {/* Left Column - Information */}
        <View className="flex-1">
          {/* Features */}
          <View className="bg-white rounded-xl p-6 border border-warm-200 mb-8">
            <Text className="text-2xl font-semibold text-warm-900 mb-6">Why Choose Our Catering?</Text>
            
            <View className="space-y-4">
              <View className="flex-row items-start">
                <Star size={20} color="#f97316" className="mt-1" />
                <View className="ml-3">
                  <Text className="font-semibold text-warm-900">Premium Quality</Text>
                  <Text className="text-warm-600">Fresh ingredients and expert preparation</Text>
                </View>
              </View>
              
              <View className="flex-row items-start">
                <Users size={20} color="#f97316" className="mt-1" />
                <View className="ml-3">
                  <Text className="font-semibold text-warm-900">Any Size Event</Text>
                  <Text className="text-warm-600">From 10 to 500+ guests</Text>
                </View>
              </View>
              
              <View className="flex-row items-start">
                <Clock size={20} color="#f97316" className="mt-1" />
                <View className="ml-3">
                  <Text className="font-semibold text-warm-900">Flexible Timing</Text>
                  <Text className="text-warm-600">Breakfast, lunch, dinner, or late-night events</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Sample Menu */}
          <View className="bg-white rounded-xl p-6 border border-warm-200">
            <Text className="text-xl font-semibold text-warm-900 mb-4">Popular Catering Options</Text>
            
            <View className="space-y-3">
              <View className="border-l-4 border-primary-500 pl-4">
                <Text className="font-semibold text-warm-900">Corporate Lunch Package</Text>
                <Text className="text-warm-600">Perfect for business meetings and office events</Text>
              </View>
              
              <View className="border-l-4 border-primary-500 pl-4">
                <Text className="font-semibold text-warm-900">Wedding Reception Menu</Text>
                <Text className="text-warm-600">Elegant dining for your special day</Text>
              </View>
              
              <View className="border-l-4 border-primary-500 pl-4">
                <Text className="font-semibold text-warm-900">Party Platters</Text>
                <Text className="text-warm-600">Casual dining for celebrations and gatherings</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Right Column - Request Form */}
        <View className="w-96">
          {isAuthenticated ? (
            <View className="bg-white rounded-xl p-6 border border-warm-200 sticky top-4">
              <Text className="text-xl font-semibold text-warm-900 mb-6">Request a Quote</Text>
              
              <View className="space-y-4">
                <View>
                  <Text className="text-warm-700 mb-2 font-medium">Event Date *</Text>
                  <TextInput
                    value={eventDate}
                    onChangeText={setEventDate}
                    placeholder="MM/DD/YYYY"
                    className="border border-warm-200 rounded-lg p-3 text-warm-900 w-full"
                  />
                </View>

                <View>
                  <Text className="text-warm-700 mb-2 font-medium">Time *</Text>
                  <TextInput
                    value={time}
                    onChangeText={setTime}
                    placeholder="eg. 2:30pm"
                    className="border border-warm-200 rounded-lg p-3 text-warm-900 w-full"
                  />
                </View>

                <View>
                  <Text className="text-warm-700 mb-2 font-medium">Number of Guests *</Text>
                  <TextInput
                    value={guestCount}
                    onChangeText={setGuestCount}
                    placeholder="e.g., 50"
                    keyboardType="numeric"
                    className="border border-warm-200 rounded-lg p-3 text-warm-900 w-full"
                  />
                </View>

                <View>
                  <Text className="text-warm-700 mb-2 font-medium">location *</Text>
                  <TextInput
                    value={location}
                    onChangeText={setLocation}
                    placeholder="e.g., Nakawa"
                    keyboardType="numeric"
                    className="border border-warm-200 rounded-lg p-3 text-warm-900 w-full"
                  />
                </View>

                <View>
                  <Text className="text-warm-700 mb-2 font-medium">Event Description *</Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Tell us about your event, dietary restrictions, preferences, and any special requirements..."
                    multiline
                    numberOfLines={4}
                    className="border border-warm-200 rounded-lg p-3 text-warm-900 w-full"
                    style={{ textAlignVertical: 'top' }}
                  />
                </View>

                <Button
                  title="Submit Request"
                  onPress={handleSubmit}
                  loading={loading}
                  disabled={!eventDate || !guestCount || !location || !description.trim()}
                />
              </View>
            </View>
          ) : (
            <View className="bg-white rounded-xl p-6 border border-warm-200 text-center">
              <Text className="text-xl font-semibold text-warm-900 mb-4">
                Ready to Get Started?
              </Text>
              <Text className="text-warm-600 mb-6">
                Please log in to submit a catering request and receive a personalized quote.
              </Text>
              <Button
                title="Login to Continue"
                onPress={() => router.push('/auth/login')}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
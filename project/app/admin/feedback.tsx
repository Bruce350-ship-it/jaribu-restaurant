import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import axiosClient from "../../api/axiosClient";

interface Feedback {
  id: string;
  message: string;
  createdAt: string;
  User: {
    name: string;
    email: string;
    phone?: string;
  };
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axiosClient.get("/api/feedback/");
      setFeedbacks(response.data);
    } catch (err) {
      console.error("Failed to fetch feedbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-warm-600">Loading feedbacks...</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 p-6 bg-warm-50">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl text-warm-900 font-bold">Meals Management</Text>
        <TouchableOpacity onPress={() => router.replace('/admin')}>
          <Text className="text-lg font-bold">Done</Text>
        </TouchableOpacity>
      </View>
      
      {feedbacks.map((fb) => (
        <View key={fb.id} className="bg-white rounded-xl p-4 mb-4 border border-warm-200">
          <Text className="font-semibold text-warm-900">{fb.User.name}</Text>
          <Text className="text-warm-600 text-sm">{fb.User.email}</Text>
          {fb.User.phone && <Text className="text-warm-600 text-sm">{fb.User.phone}</Text>}
          <Text className="mt-2 text-warm-700">{fb.message}</Text>
          <Text className="text-warm-500 text-xs mt-2">{new Date(fb.createdAt).toLocaleString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

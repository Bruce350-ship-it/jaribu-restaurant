import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Calendar, Users, MapPin, Clock, CircleCheck as CheckCircle, Circle as XCircle, FileText } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { CateringRequest } from '../../types';
import { router } from 'expo-router';
import Button from '../../components/Button';
import axiosClient from '../../api/axiosClient';

export default function WebCateringRequestsScreen() {
  const { requireAuth } = useAuth();
  const [requests, setRequests] = useState<CateringRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth()) return;
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axiosClient.get('/api/catering');
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch catering requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: CateringRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={24} color="#f59e0b" />;
      case 'approved':
        return <CheckCircle size={24} color="#10b981" />;
      case 'rejected':
        return <XCircle size={24} color="#ef4444" />;
      default:
        return <Clock size={24} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: CateringRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-warm-600">Loading catering requests...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 overflow-y-auto px-20 py-8">
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-3xl font-bold text-warm-900">Catering Requests</Text>
        <Button
          title="New Request"
          onPress={() => router.push('/(web)/catering')}
        />
      </View>

      {requests.length === 0 ? (
        <View className="bg-white rounded-xl p-12 border border-warm-200 text-center">
          <FileText size={80} color="#d1d5db" className="mx-auto mb-6" />
          <Text className="text-xl font-semibold text-warm-900 mb-4">No catering requests</Text>
          <Text className="text-warm-600 mb-6">
            Submit your first catering request to get a personalized quote for your event.
          </Text>
          <Button
            title="Submit Request"
            onPress={() => router.push('/(web)/catering')}
          />
        </View>
      ) : (
        <View className="space-y-6">
          {requests.map((request) => (
            <View key={request.id} className="bg-white rounded-xl p-6 border border-warm-200 hover:shadow-md transition-shadow">
              <View className="flex-row justify-between items-start mb-4">
                <View>
                  <Text className="text-xl font-semibold text-warm-900 mb-1">
                    Request #{request.id/*.slice(-8)*/}
                  </Text>
                  <Text className="text-warm-600">
                    Submitted on {new Date(request.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View className={`flex-row items-center px-4 py-2 rounded-full ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                  <Text className={`ml-2 font-medium ${getStatusColor(request.status).split(' ')[0]}`}>
                    {(request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : "pending")}
                  </Text>
                </View>
              </View>

              {/* Event Details */}
              <View className="bg-warm-50 rounded-lg p-4 mb-4">
                <Text className="font-semibold text-warm-900 mb-3">Event Details</Text>
                <View className="grid grid-cols-3 gap-4">
                  <View className="flex-row items-center">
                    <Calendar size={16} color="#78716c" />
                    <View className="ml-2">
                      <Text className="text-warm-600 text-sm">Event Date</Text>
                      <Text className="text-warm-900 font-medium">
                        {new Date(request.eventDate).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center">
                    <Users size={16} color="#78716c" />
                    <View className="ml-2">
                      <Text className="text-warm-600 text-sm">Guests</Text>
                      <Text className="text-warm-900 font-medium">{request.guests}</Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center">
                    <MapPin size={16} color="#78716c" />
                    <View className="ml-2">
                      <Text className="text-warm-600 text-sm">Location</Text>
                      <Text className="text-warm-900 font-medium">{request.location}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Description */}
              <View>
                <Text className="font-semibold text-warm-900 mb-2">Event Description</Text>
                <Text className="text-warm-700 leading-relaxed">{request.details}</Text>
              </View>

              {request.status === 'approved' && (
                <View className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <Text className="text-green-800 font-medium">
                    🎉 Your catering request has been approved! We'll contact you soon with the final details.
                  </Text>
                </View>
              )}

              {request.status === 'rejected' && (
                <View className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <Text className="text-red-800 font-medium">
                    We're sorry, but we're unable to accommodate this request. Please contact us to discuss alternatives.
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
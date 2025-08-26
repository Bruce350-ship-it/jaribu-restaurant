/*
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { router } from 'expo-router';
import { Package, Calendar, MessageSquare, CookingPot } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Order, CateringRequest, Feedback, MenuItem } from '../../types';
import axiosClient from '../../api/axiosClient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function AdminDashboard() {
  const { user, requireAuth, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [cateringRequests, setCateringRequests] = useState<CateringRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth() || user?.role !== 'admin') {
      router.replace('/');
      return;
    }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, cateringRes, feedbackRes, menuRes] = await Promise.all([
        axiosClient.get('/api/orders/admin/all'),
        axiosClient.get('/api/catering'),
        axiosClient.get('/api/feedback'),
        axiosClient.get('/api/menu'),
      ]);

      setOrders(ordersRes.data);
      setCateringRequests(cateringRes.data);
      setFeedbacks(feedbackRes.data);
      setMenu(menuRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: CateringRequest["status"]) => {
    try {
      await axiosClient.put(`/api/catering/${id}/status`, { status: newStatus });
      setCateringRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-warm-50">
        <Text className="text-warm-600">Loading dashboard...</Text>
      </View>
    );
  }

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const pendingCatering = cateringRequests.filter(req => req.status === 'pending');

  return (
    <SafeAreaProvider>
        <SafeAreaView className='flex-1 bg-warm-50' edges={['top', 'left', 'right']}>
    <View className="flex-1 bg-warm-50">
      <View className="flex-row justify-between items-center bg-white p-4 border-b border-warm-200">
        <Text className="text-2xl font-bold text-warm-900">Admin Dashboard</Text>
        <TouchableOpacity onPress={signOut}>
          <Text className="text-lg font-bold">Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Stats Cards /}
        <View className="flex-row flex-wrap gap-4 mb-6">
          <View className="bg-white rounded-lg p-4 flex-1 min-w-[150px] border border-warm-200">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-warm-900">{orders.length}</Text>
                <Text className="text-warm-600">Total Orders</Text>
              </View>
              <Package size={24} color="#78716c" />
            </View>
          </View>

          <View className="bg-white rounded-lg p-4 flex-1 min-w-[150px] border border-warm-200">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-orange-600">{pendingOrders.length}</Text>
                <Text className="text-warm-600">Pending Orders</Text>
              </View>
              <Package size={24} color="#ea580c" />
            </View>
          </View>

          <View className="bg-white rounded-lg p-4 flex-1 min-w-[150px] border border-warm-200">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-blue-600">{pendingCatering.length}</Text>
                <Text className="text-warm-600">Catering Requests</Text>
              </View>
              <Calendar size={24} color="#3b82f6" />
            </View>
          </View>

          <TouchableOpacity onPress={() => router.push('/admin/feedback')} className="bg-white rounded-lg p-4 flex-1 min-w-[150px] border border-warm-200">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-green-600">{feedbacks.length}</Text>
                <Text className="text-warm-600">Feedbacks</Text>
              </View>
              <MessageSquare size={24} color="#10b981" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/admin/meal')} className="bg-white rounded-lg p-4 flex-1 min-w-[150px] border border-warm-200">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-blue-600">{menu.length}</Text>
                <Text className="text-warm-600">Menu Items</Text>
              </View>
              <CookingPot size={24} color="#3b82f6" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-4 mb-6">
          {/* Recent Orders /}
          <View className='flex-1'>
          <View className="bg-white rounded-lg border border-warm-200 mb-4">
            <View className="p-4 border-b border-warm-200">
              <Text className="text-lg font-semibold text-warm-900">Recent Orders</Text>
            </View>
            {orders.slice(0, 5).map((order) => (
              <TouchableOpacity
                key={order.id}
                onPress={() => router.push(`/admin/orders/${order.id}`)}
                className="p-4 border-b border-warm-200 last:border-b-0"
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1">
                    <Text className="font-semibold text-warm-900">
                      Order #{order.id/*.slice(-8)/}
                    </Text>
                    <Text className="text-warm-600 text-sm">
                      {new Date(order.createdAt).toLocaleString()}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-semibold text-primary-500">
                      UgX. {order.totalAmount}
                    </Text>
                    <Text className={`text-sm ${
                      order.status === 'pending' ? 'text-yellow-600' :
                      order.status === 'preparing' ? 'text-blue-600' :
                      order.status === 'delivered' ? 'text-green-600' :
                      'text-red-600'
                    }`}>
                      {order.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          </View>

          {/* Recent Catering Requests /}
          <View className='flex-1'>
          <View className="bg-white rounded-lg border border-warm-200">
            <View className="p-4 border-b border-warm-200">
              <Text className="text-lg font-semibold text-warm-900">Recent Catering Requests</Text>
            </View>
            {cateringRequests.map((request) => (
              <View
                key={request.id}
                className="p-4 bg-white rounded-xl"
              >
                <Text className="font-semibold">Guests: {request.guests}</Text>
                <Text>Customer: {request.User.name}</Text>
                <Text>Contact: {request.User.phone}</Text>
                <Text>Date: {new Date(request.eventDate).toLocaleDateString()}</Text>
                <Text>Location: {request.location}</Text>
                <Text>Description: {request.details}</Text>

                <View className="mt-2">
                  <Text className="font-medium mb-1">Status:</Text>
                  <Picker
                    selectedValue={request.status}
                    onValueChange={(value) =>
                      updateStatus(request.id, value as CateringRequest["status"])
                    }
                    style={{ height: 40, width: 160 }}
                  >
                    <Picker.Item label="Pending" value="pending" />
                    <Picker.Item label="Approved" value="approved" />
                    <Picker.Item label="Rejected" value="rejected" />
                  </Picker>
                </View>
              </View>
            ))}
          </View>
          </View>
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}
*/
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { router } from 'expo-router';
import { Package, Calendar, MessageSquare, CookingPot } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Order, CateringRequest, Feedback, MenuItem } from '../../types';
import axiosClient from '../../api/axiosClient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function AdminDashboard() {
  const { user, requireAuth, signOut } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [cateringRequests, setCateringRequests] = useState<CateringRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Order filter
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    if (!requireAuth() || user?.role !== 'admin') {
      router.replace('/');
      return;
    }
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, cateringRes, feedbackRes, menuRes] = await Promise.all([
        axiosClient.get('/api/orders/admin/all'),
        axiosClient.get('/api/catering'),
        axiosClient.get('/api/feedback'),
        axiosClient.get('/api/menu'),
      ]);

      // sort orders newest first
      const ordersData: Order[] = (ordersRes.data || []).slice().sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // sort catering newest first
      const cateringData: CateringRequest[] = (cateringRes.data || []).slice().sort(
        (a, b) => new Date(a.eventDate ?? a.createdAt).getTime() - new Date(b.eventDate ?? b.createdAt).getTime()
      );

      setOrders(ordersData);
      setCateringRequests(cateringData);
      setFeedbacks(feedbackRes.data || []);
      setMenu(menuRes.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: CateringRequest["status"]) => {
    try {
      await axiosClient.put(`/api/catering/${id}/status`, { status: newStatus });
      setCateringRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-warm-50">
        <Text className="text-warm-600">Loading dashboard...</Text>
      </View>
    );
  }

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const pendingCatering = cateringRequests.filter(req => req.status === 'pending');

  // filter orders by selectedStatus
  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  return (
    <SafeAreaProvider>
      <SafeAreaView className='flex-1 bg-warm-50' edges={['top', 'left', 'right']}>
        <View className="flex-1 bg-warm-50">
          <View className="flex-row justify-between items-center bg-white p-4 border-b border-warm-200">
            <Text className="text-2xl font-bold text-warm-900">Admin Dashboard</Text>
            <TouchableOpacity onPress={signOut}>
              <Text className="text-lg font-bold">Sign Out</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            {/* Stats Cards */}
            <View className="flex-row flex-wrap gap-4 mb-6">
              <View className="bg-white rounded-lg p-4 flex-1 min-w-[150px] border border-warm-200">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-2xl font-bold text-warm-900">{orders.length}</Text>
                    <Text className="text-warm-600">Total Orders</Text>
                  </View>
                  <Package size={24} color="#78716c" />
                </View>
              </View>

              <View className="bg-white rounded-lg p-4 flex-1 min-w-[150px] border border-warm-200">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-2xl font-bold text-orange-600">{pendingOrders.length}</Text>
                    <Text className="text-warm-600">Pending Orders</Text>
                  </View>
                  <Package size={24} color="#ea580c" />
                </View>
              </View>

              <View className="bg-white rounded-lg p-4 flex-1 min-w-[150px] border border-warm-200">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-2xl font-bold text-blue-600">{pendingCatering.length}</Text>
                    <Text className="text-warm-600">Catering Requests</Text>
                  </View>
                  <Calendar size={24} color="#3b82f6" />
                </View>
              </View>

              <TouchableOpacity onPress={() => router.push('/admin/feedback')} className="bg-white rounded-lg p-4 flex-1 min-w-[150px] border border-warm-200">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-2xl font-bold text-green-600">{feedbacks.length}</Text>
                    <Text className="text-warm-600">Feedbacks</Text>
                  </View>
                  <MessageSquare size={24} color="#10b981" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push('/admin/meal')} className="bg-white rounded-lg p-4 flex-1 min-w-[150px] border border-warm-200">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-2xl font-bold text-blue-600">{menu.length}</Text>
                    <Text className="text-warm-600">Menu Items</Text>
                  </View>
                  <CookingPot size={24} color="#3b82f6" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Orders + Filter */}
            <View className="flex-row gap-4 mb-6">
              <View className='flex-1'>
                <View className="bg-white rounded-lg border border-warm-200 mb-4">
                  <View className="p-4 border-b border-warm-200 flex-row justify-between items-center">
                    <Text className="text-lg font-semibold text-warm-900">Recent Orders</Text>

                    <View className="flex-row items-center">
                      <Text className="text-warm-600 mr-2">Filter:</Text>
                      <View className="bg-white">
                        <Picker
                          selectedValue={selectedStatus}
                          onValueChange={(value) => setSelectedStatus(value)}
                          style={{ height: 40, width: 160 }}
                        >
                          <Picker.Item label="All" value="all" />
                          <Picker.Item label="Pending" value="pending" />
                          <Picker.Item label="Preparing" value="preparing" />
                          <Picker.Item label="Ready" value="ready" />
                          <Picker.Item label="Delivered" value="delivered" />
                          <Picker.Item label="Cancelled" value="cancelled" />
                        </Picker>
                      </View>
                    </View>
                  </View>

                  {filteredOrders.map((order) => (
                    <TouchableOpacity
                      key={order.id}
                      onPress={() => router.push(`/admin/orders/${order.id}`)}
                      className="p-4 border-b border-warm-200 last:border-b-0"
                    >
                      <View className="flex-row justify-between items-center">
                        <View className="flex-1">
                          <Text className="font-semibold text-warm-900">
                            Order #{order.id}
                          </Text>
                          <Text className="text-warm-600 text-sm">
                            {new Date(order.createdAt).toLocaleString()}
                          </Text>
                        </View>
                        <View className="items-end">
                          <Text className="font-semibold text-primary-500">
                            UgX. {order.totalAmount}
                          </Text>
                          <Text className={`text-sm ${
                            order.status === 'pending' ? 'text-yellow-600' :
                            order.status === 'preparing' ? 'text-blue-600' :
                            order.status === 'delivered' ? 'text-green-600' :
                            'text-red-600'
                          }`}>
                            {order.status}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}

                  {filteredOrders.length === 0 && (
                    <View className="p-6 items-center">
                      <Text className="text-warm-600">No orders for this filter.</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Recent Catering Requests */}
              <View className='flex-1'>
                <View className="bg-white rounded-lg border border-warm-200">
                  <View className="p-4 border-b border-warm-200">
                    <Text className="text-lg font-semibold text-warm-900">Recent Catering Requests</Text>
                  </View>
                  {cateringRequests.map((request) => (
                    <View
                      key={request.id}
                      className="p-4 bg-white rounded-xl"
                    >
                      <Text className="font-semibold">Guests: {request.guests}</Text>
                      {request.User && <Text>Customer: {request.User.name}</Text>}
                      {request.User && <Text>Contact: {request.User.phone}</Text>}
                      <Text>Date: {new Date(request.eventDate).toLocaleDateString()}</Text>
                      <Text>Location: {request.location}</Text>
                      {/* prefer `details` if your model uses that; adjust if it's description */}
                      <Text>Description: {request.details ?? request.details}</Text>

                      <View className="mt-2">
                        <Text className="font-medium mb-1">Status:</Text>
                        <Picker
                          selectedValue={request.status}
                          onValueChange={(value) =>
                            updateStatus(request.id, value as CateringRequest["status"])
                          }
                          style={{ height: 40, width: 160 }}
                        >
                          <Picker.Item label="Pending" value="pending" />
                          <Picker.Item label="Approved" value="approved" />
                          <Picker.Item label="Rejected" value="rejected" />
                        </Picker>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

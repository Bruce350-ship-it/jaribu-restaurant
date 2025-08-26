import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signUp(name.trim(), email.trim(), password);
      router.back();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-warm-50"
    >
      <View className="flex-1 justify-center px-6">
        <View className="bg-white rounded-lg p-6 shadow-sm border border-warm-200">
          <Text className="text-2xl font-bold text-warm-900 text-center mb-6">
            Create Account
          </Text>

          {error ? (
            <View className="bg-red-100 p-3 rounded-lg mb-4">
              <Text className="text-red-600 text-center">{error}</Text>
            </View>
          ) : null}

          <View className="mb-4">
            <Text className="text-warm-700 mb-2">Full Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              className="border border-warm-200 rounded-lg p-3 text-warm-900"
            />
          </View>

          <View className="mb-4">
            <Text className="text-warm-700 mb-2">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-warm-200 rounded-lg p-3 text-warm-900"
            />
          </View>

          <View className="mb-4">
            <Text className="text-warm-700 mb-2">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              className="border border-warm-200 rounded-lg p-3 text-warm-900"
            />
          </View>

          <View className="mb-6">
            <Text className="text-warm-700 mb-2">Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              className="border border-warm-200 rounded-lg p-3 text-warm-900"
            />
          </View>

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            className="mb-4"
          />

          <View className="flex-row justify-center">
            <Text className="text-warm-600">Already have an account? </Text>
            <Link href="/auth/login" className="no-underline">
              <Text className="text-primary-500 font-medium">Sign in</Text>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
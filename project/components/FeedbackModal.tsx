import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';
import Modal from './Modal';
import Button from './Button';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../api/axiosClient';

export default function FeedbackModal() {
  const { shouldPromptFeedback, dismissFeedbackPrompt } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;

    setLoading(true);
    try {
      await axiosClient.post('/api/feedback', {
        rating,
        comment: comment.trim() || undefined,
      });
      dismissFeedbackPrompt();
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    dismissFeedbackPrompt();
    setRating(0);
    setComment('');
  };

  return (
    <Modal
      visible={shouldPromptFeedback}
      onClose={handleDismiss}
      title="How was your experience?"
      size="medium"
    >
      <View className="space-y-4">
        <Text className="text-warm-700 text-center">
          We'd love to hear about your first order with us!
        </Text>

        <View className="items-center">
          <Text className="text-sm text-warm-600 mb-2">Rating</Text>
          <View className="flex-row space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                className="p-1"
              >
                <Star
                  size={32}
                  color={star <= rating ? '#f97316' : '#d1d5db'}
                  fill={star <= rating ? '#f97316' : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View>
          <Text className="text-sm text-warm-600 mb-2">Comments (optional)</Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Tell us about your experience..."
            multiline
            numberOfLines={3}
            className="border border-warm-200 rounded-lg p-3 text-warm-900"
            style={{ textAlignVertical: 'top' }}
          />
        </View>

        <View className="flex-row space-x-3">
          <Button
            title="Skip"
            onPress={handleDismiss}
            variant="outline"
            className="flex-1"
          />
          <Button
            title="Submit"
            onPress={handleSubmit}
            loading={loading}
            disabled={rating === 0}
            className="flex-1"
          />
        </View>
      </View>
    </Modal>
  );
}
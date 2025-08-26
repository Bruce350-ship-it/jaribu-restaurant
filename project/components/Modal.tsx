import React, { ReactNode } from 'react';
import { Modal as RNModal, View, TouchableOpacity, Text } from 'react-native';
import { X } from 'lucide-react-native';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export default function Modal({ visible, onClose, title, children, size = 'medium' }: ModalProps) {
  const sizeStyles = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg',
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className={`bg-white rounded-lg w-full ${sizeStyles[size]} max-h-[80%]`}>
          {title && (
            <View className="flex-row items-center justify-between p-4 border-b border-warm-200">
              <Text className="text-lg font-semibold text-warm-900">{title}</Text>
              <TouchableOpacity onPress={onClose} className="p-1">
                <X size={24} color="#78716c" />
              </TouchableOpacity>
            </View>
          )}
          <View className="p-4">
            {children}
          </View>
        </View>
      </View>
    </RNModal>
  );
}
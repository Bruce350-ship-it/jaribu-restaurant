import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseStyle = 'rounded-lg flex-row items-center justify-center';
  
  const variantStyles = {
    primary: 'bg-primary-500 active:bg-primary-600',
    secondary: 'bg-warm-200 active:bg-warm-300',
    outline: 'border-2 border-primary-500 bg-transparent',
  };

  const sizeStyles = {
    small: 'px-3 py-2',
    medium: 'px-4 py-3',
    large: 'px-6 py-4',
  };

  const textStyles = {
    primary: 'text-white font-semibold',
    secondary: 'text-warm-900 font-semibold',
    outline: 'text-primary-500 font-semibold',
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${
        isDisabled ? 'opacity-50' : ''
      } ${className}`}
    >
      {loading && <ActivityIndicator size="small" color="white" className="mr-2" />}
      <Text className={textStyles[variant]}>{title}</Text>
    </TouchableOpacity>
  );
}
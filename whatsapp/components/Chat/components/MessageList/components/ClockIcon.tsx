import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface ClockIconProps {
  size?: number;
  color?: string;
}

const ClockIcon = ({ size = 12, color = '#666' }: ClockIconProps) => (
  <Ionicons name="time-outline" size={size} color={color} />
);

export default ClockIcon;

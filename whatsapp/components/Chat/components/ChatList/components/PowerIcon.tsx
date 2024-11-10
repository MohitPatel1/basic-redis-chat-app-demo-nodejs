import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface PowerIconProps {
  color?: string;
  size?: number;
}

const PowerIcon = ({ color = '#000000', size = 24 }: PowerIconProps) => (
  <Ionicons name="power" size={size} color={color} />
);

export default PowerIcon; 
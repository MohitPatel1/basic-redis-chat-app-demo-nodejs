import React from 'react';
import { StyleSheet, View } from 'react-native';

interface OnlineIndicatorProps {
  online: boolean;
  hide?: boolean;
  width?: number;
  height?: number;
}

const OnlineIndicator = ({ 
  online, 
  hide = false, 
  width = 8, 
  height = 8 
}: OnlineIndicatorProps) => {
  return (
    <View
      style={[
        styles.indicator,
        {
          width,
          height,
          backgroundColor: online ? '#28a745' : '#6c757d',
          opacity: hide ? 0 : 1
        }
      ]}
    />
  );
};

const styles = StyleSheet.create({
  indicator: {
    borderRadius: 999, // Large value to ensure circle
  }
});

export default OnlineIndicator;

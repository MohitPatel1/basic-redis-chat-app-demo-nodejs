import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface InfoMessageProps {
  message: string;
}

const InfoMessage = ({ message }: InfoMessageProps) => (
  <Text style={styles.message}>{message}</Text>
);

const styles = StyleSheet.create({
  message: {
    marginBottom: 8,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6c757d',
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default InfoMessage;

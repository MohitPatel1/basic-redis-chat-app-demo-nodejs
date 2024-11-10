import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const NoMessages = () => (
  <View style={styles.container}>
    <MaterialCommunityIcons name="card-text-outline" size={96} color="#6c757d" />
    <Text style={styles.text}>No messages</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#6c757d',
    marginTop: 8,
  },
});

export default NoMessages;

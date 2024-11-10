import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const ChatIcon = () => (
  <View style={styles.container}>
    <MaterialCommunityIcons name="chat" size={32} color="#7514FB" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    backgroundColor: 'white',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatIcon;

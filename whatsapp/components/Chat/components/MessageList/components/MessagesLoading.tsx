import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const MessagesLoading = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#556ee6" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessagesLoading;

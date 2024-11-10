import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface TypingAreaProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: () => void;
}

const TypingArea = ({ message, setMessage, onSubmit }: TypingAreaProps) => {
  const handleSubmit = useCallback(() => {
    if (message.trim()) {
      onSubmit();
    }
  }, [message, onSubmit]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={styles.keyboardAvoid}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Enter Message..."
            style={styles.input}
            onSubmitEditing={handleSubmit}
            returnKeyType="send"
            enablesReturnKeyAutomatically
            blurOnSubmit={false}
            autoCapitalize="none"
            autoCorrect={false}
            multiline={false}
          />
        </View>
        <TouchableOpacity
          onPress={handleSubmit}
          style={[
            styles.sendButton,
            !message.trim() && styles.sendButtonDisabled
          ]}
          disabled={!message.trim()}
        >
          <MaterialIcons 
            name="send" 
            size={24} 
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  inputContainer: {
    flex: 1,
    marginRight: 12,
  },
  input: {
    backgroundColor: '#f5f7fb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#556ee6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default TypingArea;

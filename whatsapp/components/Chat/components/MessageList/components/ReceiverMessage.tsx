import moment from "moment";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ClockIcon from "./ClockIcon";

interface ReceiverMessageProps {
  username?: string;
  message: string;
  date: number;
}

const ReceiverMessage = ({
  username = "user",
  message,
  date,
}: ReceiverMessageProps) => (
  <View style={styles.container}>
    <View style={styles.messageContainer}>
      <View style={styles.messageContent}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.messageText}>{message}</Text>
        <View style={styles.timeContainer}>
          <ClockIcon />
          <Text style={styles.timeText}>{moment.unix(date).format("LT")}</Text>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  messageContainer: {
    marginLeft: 'auto',
    maxWidth: '50%',
  },
  messageContent: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
  },
  username: {
    color: '#556ee6',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'left',
  },
  messageText: {
    textAlign: 'left',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});

export default ReceiverMessage;

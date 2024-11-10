import { UserEntry } from "@/app/app-context";
import moment from "moment";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import OnlineIndicator from "../../OnlineIndicator";
import ClockIcon from "./ClockIcon";

interface SenderMessageProps {
  user?: UserEntry;
  message: string;
  date: number;
  onUserClicked: () => void;
}

const SenderMessage = ({
  user,
  message,
  date,
  onUserClicked,
}: SenderMessageProps) => (
  <View style={styles.container}>
    <View style={styles.messageContainer}>
      <View style={styles.messageContent}>
        {user && (
          <View style={styles.userContainer}>
            <TouchableOpacity onPress={onUserClicked}>
              <Text style={styles.username}>{user.username}</Text>
            </TouchableOpacity>
            <OnlineIndicator width={7} height={7} online={user.online || false} />
          </View>
        )}
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
    maxWidth: '50%',
  },
  messageContent: {
    backgroundColor: 'rgba(85, 110, 230, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    color: '#556ee6',
    fontWeight: '600',
    marginRight: 8,
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

export default SenderMessage;

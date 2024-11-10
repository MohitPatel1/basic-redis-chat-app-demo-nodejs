import { UserEntry } from "@/app/app-context";
import AvatarImage from "@/components/Chat/components/ChatList/components/AvatarImage";
import PowerIcon from "@/components/Chat/components/ChatList/components/PowerIcon";
import OnlineIndicator from "@/components/Chat/components/OnlineIndicator";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FooterProps {
  user: UserEntry;
  onLogOut: () => void;
}

interface UserInfoProps {
  user: UserEntry;
  col?: number;
  noinfo?: boolean;
}

interface LogoutButtonProps {
  onLogOut: () => void;
  col?: number;
  noinfo?: boolean;
}

const Footer = ({ user, onLogOut }: FooterProps) => (
  <View style={styles.container}>
    {true ? (
      <>
        <UserInfo user={user} col={8} />
        <LogoutButton onLogOut={onLogOut} col={4} />
      </>
    ) : (
      <>
        <LogoutButton noinfo onLogOut={onLogOut} col={8} />
        <UserInfo noinfo user={user} col={4} />
      </>
    )}
  </View>
);

const LogoutButton = ({ onLogOut, col = 5, noinfo = false }: LogoutButtonProps) => (
  <TouchableOpacity
    onPress={onLogOut}
    style={[
      styles.logoutButton,
      { flex: col },
      !noinfo && styles.logoutButtonRight
    ]}
  >
    <PowerIcon color="#dc3545" />
    <Text style={styles.logoutText}>Log out</Text>
  </TouchableOpacity>
);

const UserInfo = ({ user, col = 7, noinfo = false }: UserInfoProps) => (
  <View
    style={[
      styles.userInfo,
      { flex: col },
      noinfo && styles.userInfoRight
    ]}
  >
    <View style={[styles.avatarContainer, noinfo ? {} : styles.avatarMargin]}>
      <AvatarImage name={user.username} id={user.id} />
    </View>
    {!noinfo && (
      <View style={styles.userDetails}>
        <Text style={styles.username}>{user.username}</Text>
        <View style={styles.statusContainer}>
          <OnlineIndicator online={true} />
          <Text style={styles.statusText}>Active</Text>
        </View>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    minHeight: 50,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
  },
  logoutButtonRight: {
    justifyContent: 'flex-end',
  },
  logoutText: {
    color: '#dc3545',
    marginLeft: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoRight: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    alignSelf: 'center',
  },
  avatarMargin: {
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 13,
  },
});

export default Footer;

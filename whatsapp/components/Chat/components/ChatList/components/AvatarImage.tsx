import { getAvatarByUserAndRoomId } from "@/utils/getAvatarByUserAndRoomId";
import React, { useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";
import ChatIcon from "./ChatIcon";

const AvatarImage = ({ name, id }: { name: string, id: string | number }) => {
  const url = useMemo(() => {
    const av = getAvatarByUserAndRoomId("" + id);
    if (name === "Mary") {
      return require("@/assets/avatars/0.jpg");
    } else if (name === "Pablo") {
      return require("@/assets/avatars/2.jpg");
    } else if (name === "Joe") {
      return require("@/assets/avatars/9.jpg");
    } else if (name === "Alex") {
      return require("@/assets/avatars/8.jpg");
    }
    return av;
  }, [id, name]);

  return (
    <>
      {name !== "General" ? (
        <Image
          source={typeof url === 'string' ? { uri: url } : url}
          style={styles.avatar}
        />
      ) : (
        <View style={styles.iconContainer}>
          <ChatIcon />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  iconContainer: {
    overflow: 'hidden',
    borderRadius: 16,
  }
});

export default AvatarImage;

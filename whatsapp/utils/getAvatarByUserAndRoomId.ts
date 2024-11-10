
/** Get an avatar for a room or a user */
export const getAvatarByUserAndRoomId = (roomId = "1") => {
  const TOTAL_IMAGES = 13;
  const seed1 = 654;
  const seed2 = 531;

  const uidParsed = +roomId.split(":").pop();
  let roomIdParsed = +roomId.split(":").reverse().pop();
  if (roomIdParsed < 0) {
    roomIdParsed += 3555;
  }

  const theId = (uidParsed * seed1 + roomIdParsed * seed2) % TOTAL_IMAGES;

  return `${process.env.PUBLIC_URL}/avatars/${theId}.jpg`;
};
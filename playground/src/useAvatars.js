const avatarItems = [
  {
    id: "carlos",
    name: "Carlos Lopez",
    avatarSrc: "https://i.pravatar.cc/128?img=12",
  },
  {
    id: "diana",
    name: "Diana Chen",
    avatarSrc: "https://i.pravatar.cc/128?img=47",
  },
];

export const useAvatars = () => {
  const getAvatarByIndex = (index) => {
    if (!Number.isInteger(index) || index < 0 || avatarItems.length === 0) {
      return undefined;
    }

    return avatarItems[index % avatarItems.length];
  };

  return {
    getAvatarByIndex,
  };
};
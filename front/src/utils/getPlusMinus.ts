export const getPlusMinus = (alterStars: number) => {
  if (alterStars > 0) {
    return 'Plus';
  }

  if (alterStars < 0) {
    return 'Minus';
  }
  return 'None';
};

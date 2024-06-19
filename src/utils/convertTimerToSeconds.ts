export default (timer: string) => {
  const timerArray = (timer.match(/\d+/g) || []).reverse();

  if (timerArray.length <= 0 || timerArray.length >= 4) {
    throw new Error('Invalid Timer');
  }

  const seconds = timerArray.reduce((prev, current, index) => {
    return (Number(prev) + Number(current) * 60 ** index).toString();
  });

  return Number(seconds);
};

export const isBefore = (dateLeft, dateRight) => {
  return new Date(dateLeft).getTime() < new Date(dateRight).getTime();
};

const isAfter = (dateLeft, dateRight) => {
  return new Date(dateLeft).getTime() > new Date(dateRight).getTime();
};
/**
 * @param {string} dateLeft
 * @param {string} dateRight
 * @returns {boolean}
 */
export const isSameDay = (dateLeft, dateRight) => {
  const left = new Date(dateLeft);
  left.setHours(0, 0, 0, 0);
  const right = new Date(dateRight);
  right.setHours(0, 0, 0, 0);
  return left.getTime() === right.getTime();
};

/**
 *
 * @param {string} ts
 * @returns {string}
 */
export const formatTime = (ts) => {
  return new Intl.DateTimeFormat("ja-jp", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(ts));
};

/**
 * @param {string} closeAt
 * @param {number | Date} now
 * @returns {string}
 */
export const formatCloseAt = (closeAt, now = new Date()) => {
  if (isBefore(new Date(closeAt), now)) {
    return "投票締切";
  }

  if (isAfter(new Date(closeAt), new Date(now.setHours(now.getHours() + 2)))) {
    return "投票受付中";
  }

  const diff = (now.getTime() - new Date(closeAt).getTime()) / 3600000;
  return `締切${Math.trunc(diff)}分前`;
};

export const gen = {
  string: (length: number = 15) =>
    Math.random()
      .toString(36)
      .substring(2, length + 2),
  int: (from: number = 0, to: number = 100) => Math.floor(Math.random() * (to - from + 1) + from),
  float: (from: number = 0, to: number = 100, decimalCases: number = 2) =>
    Math.floor((Math.random() * (to - from + 1) + from) * Math.pow(10, decimalCases)) / Math.pow(10, decimalCases),
  date: (from: Date = new Date('2000-01-01'), to: Date = new Date()) =>
    new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime())),
  randomFromArray: <T extends unknown>(array: T[]) => array[Math.floor(Math.random() * array.length)],
  uuid: () => btoa(unescape(encodeURIComponent(Math.random().toString(36).substring(7)))),
};

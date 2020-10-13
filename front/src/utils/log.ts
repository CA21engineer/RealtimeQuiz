/* eslint @typescript-eslint/no-explicit-any: 0 */

function error(...message: any): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  console.error(message);
}

function warn(...message: any): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  console.warn(message);
}

function log(...message: any): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  console.log(message);
}

export const devlog = {
  error,
  warn,
  log,
};

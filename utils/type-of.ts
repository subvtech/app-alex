export function typeOf(value: unknown) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

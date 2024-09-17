/**
 * Converts a string to its Latin alphabet equivalent by removing diacritical marks.
 *
 * This function normalizes the input string using Unicode Normalization Form D (NFD),
 * which separates characters and their diacritical marks. It then removes all diacritical
 * marks using a regular expression.
 *
 * @param {string} str - The input string to be latinized. Defaults to an empty string.
 * @returns {string} - The latinized string with diacritical marks removed.
 */
export function latinize(str = ''): string {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

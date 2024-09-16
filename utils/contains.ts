import { curry } from './curry';
import { latinize } from './latinize';

/**
 * Checks if a given text contains a specified value, ignoring case and diacritical marks.
 *
 * This function uses the `latinize` utility to remove diacritical marks from both the text
 * and the value before performing the case-insensitive comparison. The `curry` function is
 * used to allow partial application of the function.
 *
 * @param {string} text - The text to search within.
 * @param {string} search - The value to search for in the text.
 * @returns {boolean} - True if the text contains the value, false otherwise.
 *
 * @example
 * const containsHello = contains("Hello");
 * console.log(containsHello("Hello, World!")); // true
 * console.log(containsHello("Hi there")); // false
 *
 * @example
 * console.log(contains("Café", "cafe")); // true
 * console.log(contains("résumé", "Resume")); // true
 */
export const contains = curry((text: string, search: string): boolean => {
  return latinize(text)
    .toLowerCase()
    .includes(latinize(search).toLowerCase().trim());
});

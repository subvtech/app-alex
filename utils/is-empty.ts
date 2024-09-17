/**
 * Checks if a value is empty.
 *
 * @param value - The value to check for emptiness.
 * @returns True if the value is considered empty, false otherwise.
 *
 * @description
 * This function checks various types of values for emptiness:
 * - null or undefined: Always considered empty
 * - String: Considered empty if it contains only whitespace
 * - Array: Considered empty if it has no elements
 * - Map or Set: Considered empty if it has no entries
 * - Object: Considered empty if it has no own enumerable properties
 * - Other types: Always considered non-empty
 *
 * @example
 * isEmpty(null);        // returns true
 * isEmpty('');          // returns true
 * isEmpty('  ');        // returns true
 * isEmpty([]);          // returns true
 * isEmpty({});          // returns true
 * isEmpty(new Map());   // returns true
 * isEmpty(new Set());   // returns true
 * isEmpty(0);           // returns false
 * isEmpty(false);       // returns false
 * isEmpty('hello');     // returns false
 * isEmpty([1, 2, 3]);   // returns false
 * isEmpty({ a: 1 });    // returns false
 */
export function isEmpty(value: unknown): boolean {
  if (value == null || value === '') {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
}

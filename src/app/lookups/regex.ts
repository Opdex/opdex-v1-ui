
/**
 * Sanitizes form inputs allowing 1, 1., 1.0
 * Note - this sanitization allows the value to end with a decimal point intentionally
 * \d* - enforces ending with an optional number
 * \d+ would enforce ending with a digit after the decimal
 */
export const DecimalStringRegex = /\d*\.?\d*/;

export function sanitize(regex: RegExp, value: string): string {
  var sanitized = regex.exec(value);

  if (sanitized == null) {
    return '';
  }

  return sanitized.toString();
}

export const PositiveDecimalNumberRegex = /^([0-9]+\.?[0-9]*|\.[0-9]+)$/;
export const PositiveOrNegativeDecimalNumberRegex = /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/;

export function sanitize(regex: RegExp, value: string): string {
  var sanitized = regex.exec(value);

  if (sanitized == null) {
    return '';
  }

  return sanitized.toString();
}

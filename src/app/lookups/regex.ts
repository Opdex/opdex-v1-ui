export const PositiveDecimalNumberRegex = /^(?!-0?(\.0+)?$)-?(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/;
export const PositiveOrNegativeDecimalNumberRegex = /^-?(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/;

export function sanitize(regex: RegExp, value: string): string {
  var sanitized = regex.exec(value);

  if (sanitized == null) {
    return '';
  }

  return sanitized.toString();
}

/**
 * Extract a displayable string from a backend message that may be
 * `string`, `string[]`, or an `errors` record.
 */
export const extractMessage = (msg: unknown): string | undefined => {
  if (Array.isArray(msg)) return msg[0];
  if (typeof msg === "string") return msg;
  if (msg && typeof msg === "object" && "message" in msg) {
    return extractMessage((msg as { message: unknown }).message);
  }
  return undefined;
};

/**
 * Extract the first field-level error from a 422 errors object.
 * Backend shape: `{ errors: { username: ["…"], email: ["…"], mobile: ["…"] } }`
 */
export const extractFieldError = (
  errors: Record<string, string[]> | undefined,
): string | undefined => {
  if (!errors || typeof errors !== "object") return undefined;
  for (const field of Object.keys(errors)) {
    const fieldErrors = errors[field];
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      return fieldErrors[0];
    }
  }
  return undefined;
};

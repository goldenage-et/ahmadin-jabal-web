export function generateCode(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase().substring(0, 6);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

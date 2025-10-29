export default function extractString(obj: any): string[] {
  return Object.values(obj).reduce((acc: string[], value) => {
    if (typeof value === 'object') {
      acc.push(...extractString(value));
    } else if (typeof value === 'string') {
      acc.push(value);
    }
    return acc;
  }, []);
}

export function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T,
): [T[keyof T], ...T[keyof T][]] {
  if (!myEnum || typeof myEnum !== 'object') {
    throw new Error('Invalid enum provided to enumToPgEnum');
  }
  return Object.values(myEnum).map((value: any) => `${value}`) as any;
}

// list to enum

import { TBookImage } from '@repo/common';

export const getBookImage = (images: TBookImage[]) => {
  if (images.length === 0) return '/placeholder.jpg';
  const mainImage = images?.find((image) => image.isMain);
  return mainImage?.url || images?.[0]?.url || '/placeholder.jpg';
};

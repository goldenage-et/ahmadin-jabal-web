import {
  Smartphone,
  Globe,
  Footprints,
  Bike,
  Headphones,
  Laptop,
  Palette,
  ShoppingBag,
  Shirt,
  Home,
  Utensils,
  Droplets,
  ChefHat,
  Wrench,
  Battery,
  Printer,
  Baby,
  PawPrint,
  Car,
  Heart,
  Star,
  Music,
  Camera,
  Gamepad2,
  Book,
  Coffee,
  Gift,
  Sparkles,
  Zap,
} from 'lucide-react';

// Map of icon names to Lucide React icons
export const iconMap: Record<string, any> = {
  smartphone: Smartphone,
  globe: Globe,
  footprints: Footprints,
  bike: Bike,
  headphones: Headphones,
  laptop: Laptop,
  palette: Palette,
  'shopping-bag': ShoppingBag,
  shirt: Shirt,
  home: Home,
  utensils: Utensils,
  droplets: Droplets,
  'chef-hat': ChefHat,
  wrench: Wrench,
  battery: Battery,
  printer: Printer,
  baby: Baby,
  'paw-print': PawPrint,
  car: Car,
  heart: Heart,
  star: Star,
  music: Music,
  camera: Camera,
  gamepad2: Gamepad2,
  book: Book,
  coffee: Coffee,
  gift: Gift,
  sparkles: Sparkles,
  zap: Zap,
};

// Default fallback icon
export const defaultIcon = ShoppingBag;

// Function to get icon component by name
export function getIconByName(iconName: string | null | undefined) {
  if (!iconName) return defaultIcon;

  const normalizedName = iconName.toLowerCase().replace(/\s+/g, '-');
  return iconMap[normalizedName] || defaultIcon;
}

// Function to get default background color if not provided
export function getDefaultBackgroundColor(index: number): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500',
    'bg-lime-500',
    'bg-amber-500',
  ];

  return colors[index % colors.length];
}

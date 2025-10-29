'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import * as LucideIcons from 'lucide-react';

// Popular Lucide React icons organized by category
const iconCategories = {
  'Electronics & Tech': [
    'Smartphone',
    'Laptop',
    'Monitor',
    'Headphones',
    'Camera',
    'Tv',
    'Radio',
    'Speaker',
    'Mic',
    'Wifi',
    'Bluetooth',
    'Battery',
    'Plug',
    'Cpu',
    'HardDrive',
  ],
  'Clothing & Fashion': [
    'Shirt',
    'Pants',
    'Dress',
    'Hat',
    'Shoe',
    'Sock',
    'Glove',
    'Belt',
    'Watch',
    'Glasses',
    'Bag',
    'Wallet',
    'Jewelry',
    'Ring',
  ],
  'Food & Dining': [
    'Utensils',
    'Fork',
    'Knife',
    'Spoon',
    'Plate',
    'Bowl',
    'Cup',
    'Mug',
    'Coffee',
    'Wine',
    'Beer',
    'Pizza',
    'Cake',
    'Apple',
    'Banana',
    'Carrot',
  ],
  'Home & Garden': [
    'Home',
    'Bed',
    'Sofa',
    'Chair',
    'Table',
    'Lamp',
    'Plant',
    'Tree',
    'Flower',
    'Leaf',
    'Sun',
    'Moon',
    'Star',
    'Building',
  ],
  'Tools & Hardware': [
    'Hammer',
    'Wrench',
    'Screwdriver',
    'Drill',
    'Saw',
    'Tool',
    'Box',
    'Crate',
  ],
  'Sports & Recreation': [
    'Ball',
    'Football',
    'Basketball',
    'Tennis',
    'Golf',
    'Swimming',
    'Running',
    'Cycling',
    'Hiking',
    'Camping',
    'Fishing',
    'Hunting',
  ],
  Transportation: [
    'Car',
    'Truck',
    'Bus',
    'Train',
    'Plane',
    'Bike',
    'Motorcycle',
    'Boat',
    'Ship',
    'Rocket',
    'Taxi',
    'Van',
  ],
  'Health & Medical': [
    'Heart',
    'Cross',
    'Pill',
    'Syringe',
    'Stethoscope',
    'Bandage',
    'Thermometer',
    'Scale',
    'Weight',
    'Fitness',
    'Gym',
  ],
  'Education & Office': [
    'Book',
    'Pen',
    'Pencil',
    'Paper',
    'Clipboard',
    'Calculator',
    'Ruler',
    'Compass',
    'Globe',
    'Map',
    'Chart',
    'Graph',
  ],
  Entertainment: [
    'Music',
    'Video',
    'Gamepad2',
    'Dice6',
    'Puzzle',
    'Theater',
    'Ticket',
    'Gift',
    'Party',
    'Celebration',
  ],
  'Business & Finance': [
    'DollarSign',
    'Euro',
    'Pound',
    'Yen',
    'CreditCard',
    'Wallet',
    'Bank',
    'TrendingUp',
    'TrendingDown',
    'ChartLine',
  ],
  'Nature & Weather': [
    'Sun',
    'Moon',
    'Cloud',
    'CloudRain',
    'Snowflake',
    'Wind',
    'CloudStorm',
    'Flame',
    'Droplets',
    'Mountain',
    'Waves',
    'Trees',
  ],
};

// Flatten all icons for easy access
const allIcons = Object.values(iconCategories).flat();

interface IconDropdownProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Function to render Lucide icon
const renderLucideIcon = (iconName: string, size: number = 16) => {
  const IconComponent = (LucideIcons as any)[iconName];
  if (IconComponent) {
    return <IconComponent size={size} />;
  }
  return <LucideIcons.Package size={size} />; // fallback icon
};

export function IconDropdown({
  value,
  onValueChange,
  placeholder = 'Select an icon...',
  className,
}: IconDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter icons based on search term
  const filteredIcons = searchTerm
    ? allIcons.filter((icon) =>
        icon.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : allIcons;

  // Get current icon name for display
  const selectedIcon = value ? allIcons.find((icon) => icon === value) : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          {selectedIcon ? (
            <div className='flex items-center gap-2'>
              <div className='flex items-center justify-center w-5 h-5'>
                {renderLucideIcon(selectedIcon, 16)}
              </div>
              <span className='text-sm'>{selectedIcon}</span>
            </div>
          ) : (
            <span className='text-muted-foreground'>{placeholder}</span>
          )}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[400px] p-0' align='start'>
        <Command>
          <CommandInput
            placeholder='Search icons...'
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>No icon found.</CommandEmpty>
            {searchTerm ? (
              // Show filtered results when searching
              <CommandGroup>
                {filteredIcons.map((icon) => (
                  <CommandItem
                    key={icon}
                    value={icon}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    <div className='flex items-center gap-2'>
                      <div className='flex items-center justify-center w-5 h-5'>
                        {renderLucideIcon(icon, 16)}
                      </div>
                      <span className='text-sm'>{icon}</span>
                    </div>
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        value === icon ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              // Show categorized results when not searching
              Object.entries(iconCategories).map(([category, icons]) => (
                <CommandGroup key={category} heading={category}>
                  {icons.map((icon) => (
                    <CommandItem
                      key={icon}
                      value={icon}
                      onSelect={(currentValue) => {
                        onValueChange(
                          currentValue === value ? '' : currentValue,
                        );
                        setOpen(false);
                      }}
                    >
                      <div className='flex items-center gap-2'>
                        <div className='flex items-center justify-center w-5 h-5'>
                          {renderLucideIcon(icon, 16)}
                        </div>
                        <span className='text-sm'>{icon}</span>
                      </div>
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          value === icon ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

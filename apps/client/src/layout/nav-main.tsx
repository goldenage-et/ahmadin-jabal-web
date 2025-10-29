'use client';

import { SidebarMenu } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { ChevronRight } from 'lucide-react';
import React from 'react';
import { NavItemProps, Route } from './types';
import Link from 'next/link';

interface NavMainProps {
  className?: string;
  items: Route[];
}

export function NavMain({ className, items }: NavMainProps) {
  const pathname = usePathname();
  return (
    <SidebarMenu className={className}>
      {items.map((item) => (
        <NavItem
          key={item.title}
          item={item}
          pathname={pathname}
        />
      ))}
    </SidebarMenu>
  );
}

function NavItem({
  item,
  pathname,
}: NavItemProps & { pathname: string }) {
  const renderMenuButton = () => {
    return (
      <SidebarMenuButton tooltip={item.title} asChild>
        <Link href={item.url}>
          {item.icon && React.cloneElement(item.icon as React.ReactElement<{ className: string }>, { className: 'h-4 w-4' })}
          <span>{item.title}</span>
          {item.items && item.items.length > 0 && (
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          )}
        </Link>
      </SidebarMenuButton>
    )
  }


  if (!item.items || item.items.length < 1) return renderMenuButton()
  return (
    <Collapsible
      key={item.title}
      asChild
      defaultOpen={item.isActive(pathname)}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          {renderMenuButton()}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton asChild>
                  <Link href={subItem.url}>
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>

  );
}

'use client';

import { TUserBasic } from '@repo/common';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Mail, Phone, User } from 'lucide-react';
import Image from 'next/image';

type TUser = {
    id: string;
    firstName: string;
    middleName: string;
    email: string;
    lastName?: string | null;
    phone?: string | null;
    imageUrl?: string;
};

export default function UserHoverCard({
    user,
    showName,
    showEmail,
}: {
    user: TUser;
    showName?: boolean;
    showEmail?: boolean;
}) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild className="">
                <div
                    key={user.id}
                    className="flex items-center gap-2 cursor-pointer z-0"
                >
                    <Avatar
                        className={cn(
                            'flex aspect-square items-center justify-center  rounded-md  bg-sidebar-primary text-sidebar-primary-foreground',
                            ' size-7',
                        )}
                    >
                        {user?.imageUrl ? (
                            <Image
                                width={200}
                                height={200}
                                src={user.imageUrl}
                                alt={'profile image'}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <AvatarFallback className="rounded-sm bg-primary w-10">
                                {user?.firstName?.[0] || <User className="size-4" />}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex flex-col">
                        {showName && (
                            <span className="text-sm font-semibold">
                                {user.firstName} {user.middleName}
                            </span>
                        )}
                        {showEmail && (
                            <span className="text-sm text-muted-foreground">
                                {user.email}
                            </span>
                        )}
                    </div>
                </div>
            </HoverCardTrigger>
            <HoverCardContent
                side="bottom"
                align="start"
                className="w-fit z-100000"
            >
                <div className="flex justify-between space-x-4">
                    <Avatar>
                        {user?.imageUrl ? (
                            <Image
                                width={200}
                                height={200}
                                src={user.imageUrl}
                                alt={'profile image'}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <AvatarFallback className="rounded-sm bg-primary w-10">
                                {user?.firstName?.[0] || <User className="size-4" />}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">
                            {user.firstName} {user.middleName} {user.lastName}
                        </h4>
                        <div className="flex items-center pt-2">
                            <Mail className="mr-2 h-4 w-4 opacity-70" />{' '}
                            <span className="text-sm text-muted-foreground">
                                {user.email}
                            </span>
                        </div>
                        <div className="flex items-center pt-2">
                            <Phone className="mr-2 h-4 w-4 opacity-70" />{' '}
                            <span className="text-sm text-muted-foreground">
                                {user.phone}
                            </span>
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}


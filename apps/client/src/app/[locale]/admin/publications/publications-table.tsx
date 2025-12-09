'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { EPublicationStatus, TPublicationBasic } from '@repo/common';
import { Eye, MoreHorizontal, Edit, Star, Lock } from 'lucide-react';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PublicationsTableProps {
    publications: TPublicationBasic[];
}

export function PublicationsTable({ publications }: PublicationsTableProps) {
    const formatDate = (date: Date | string | null | undefined) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusBadge = (status: EPublicationStatus) => {
        switch (status) {
            case EPublicationStatus.published:
                return (
                    <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Published
                    </Badge>
                );
            case EPublicationStatus.draft:
                return (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Draft
                    </Badge>
                );
            case EPublicationStatus.archived:
                return (
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                        Archived
                    </Badge>
                );
            case EPublicationStatus.scheduled:
                return (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        Scheduled
                    </Badge>
                );
            default:
                return <Badge variant="secondary" className="bg-secondary text-secondary-foreground">{status}</Badge>;
        }
    };

    if (publications.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground">No publications found</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Featured</TableHead>
                                <TableHead>Premium</TableHead>
                                <TableHead>Views</TableHead>
                                <TableHead>Downloads</TableHead>
                                <TableHead>Published</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {publications.map((publication) => (
                                <TableRow key={publication.id} className="hover:bg-muted/50">
                                    <TableCell>
                                        <div className="font-medium max-w-[300px] truncate">
                                            {publication.title}
                                        </div>
                                        {publication.excerpt && (
                                            <div className="text-sm text-muted-foreground max-w-[300px] truncate">
                                                {publication.excerpt}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(publication.status)}
                                    </TableCell>
                                    <TableCell>
                                        {publication.featured ? (
                                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {publication.isPremium ? (
                                            <Lock className="h-4 w-4 text-primary" />
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {publication.viewCount?.toLocaleString() || 0}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {publication.downloadCount?.toLocaleString() || 0}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(publication.publishedAt)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/publications/${publication.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/publications/${publication.id}/edit`}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}





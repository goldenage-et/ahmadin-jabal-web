'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    TCategoryBasic,
    TUpdateBlog,
    ZUpdateBlog,
    EBlogStatus,
    TBlogDetail,
} from '@repo/common';
import { ArrowLeft, Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { updateBlog } from '@/actions/blog.action';
import { uploadFile } from '@/lib/file-upload';
import { slugify } from '@/lib/slugify';
import { toast } from 'sonner';
import Image from 'next/image';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface EditBlogFormProps {
    blog: TBlogDetail;
    categories?: TCategoryBasic[];
}

export default function EditBlogForm({
    blog,
    categories = [],
}: EditBlogFormProps) {
    const router = useRouter();
    const [tags, setTags] = useState<string[]>(blog.tags || []);
    const [newTag, setNewTag] = useState('');
    const [featuredImage, setFeaturedImage] = useState<string>(
        blog.featuredImage || '',
    );
    const [isUploading, setIsUploading] = useState(false);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        title: false,
        excerpt: false,
        content: false,
    });
    const { mutate, isLoading } = useApiMutation();

    const toggleSection = (section: string) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const form = useForm<TUpdateBlog>({
        resolver: zodResolver(ZUpdateBlog) as any,
        defaultValues: {
            title: blog.title,
            titleAm: blog.titleAm || undefined,
            titleOr: blog.titleOr || undefined,
            slug: blog.slug,
            excerpt: blog.excerpt || undefined,
            excerptAm: blog.excerptAm || undefined,
            excerptOr: blog.excerptOr || undefined,
            content: blog.content || undefined,
            contentAm: blog.contentAm || undefined,
            contentOr: blog.contentOr || undefined,
            tags: blog.tags || [],
            status: blog.status,
            featured: blog.featured,
            isFree: blog.isFree,
            price: blog.price || undefined,
            featuredImage: blog.featuredImage || undefined,
            images: blog.medias || undefined,
            publishedAt: blog.publishedAt
                ? new Date(blog.publishedAt)
                : undefined,
            expiresAt: blog.expiresAt ? new Date(blog.expiresAt) : undefined,
        },
    });

    useEffect(() => {
        form.reset({
            title: blog.title,
            titleAm: blog.titleAm || undefined,
            titleOr: blog.titleOr || undefined,
            slug: blog.slug,
            excerpt: blog.excerpt || undefined,
            excerptAm: blog.excerptAm || undefined,
            excerptOr: blog.excerptOr || undefined,
            content: blog.content || undefined,
            contentAm: blog.contentAm || undefined,
            contentOr: blog.contentOr || undefined,
            tags: blog.tags || [],
            status: blog.status,
            featured: blog.featured,
            isFree: blog.isFree,
            price: blog.price || undefined,
            featuredImage: blog.featuredImage || undefined,
            images: blog.medias || undefined,
            publishedAt: blog.publishedAt
                ? new Date(blog.publishedAt)
                : undefined,
            expiresAt: blog.expiresAt ? new Date(blog.expiresAt) : undefined,
        });
        setTags(blog.tags || []);
        setFeaturedImage(blog.featuredImage || '');
    }, [blog, form]);

    // Auto-generate slug from title
    const title = form.watch('title');
    const isFree = form.watch('isFree');
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

    useEffect(() => {
        if (title && !isSlugManuallyEdited) {
            const generatedSlug = slugify(title);
            form.setValue('slug', generatedSlug);
        }
    }, [title, form, isSlugManuallyEdited]);

    // Clear price when blog is set to free
    useEffect(() => {
        if (isFree) {
            form.setValue('price', undefined);
        }
    }, [isFree, form]);

    // Track if user manually edits the slug
    const handleSlugChange = (value: string) => {
        setIsSlugManuallyEdited(true);
        form.setValue('slug', value);
    };

    const addTag = () => {
        const trimmed = newTag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            const newTagsArr = [...tags, trimmed];
            setTags(newTagsArr);
            form.setValue('tags', newTagsArr);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        const filtered = tags.filter((tag) => tag !== tagToRemove);
        setTags(filtered);
        form.setValue('tags', filtered);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadFile(file);
            setFeaturedImage(url);
            form.setValue('featuredImage', url);
            toast.success('Image uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className='space-y-6 p-6 mx-auto bg-linear-to-br from-background via-card to-card dark:from-background dark:via-card dark:to-card'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((data) => {
                        mutate(async () => await updateBlog(blog.id, data), {
                            onSuccess: () => {
                                router.push(`/admin/blogs/${blog.id}`);
                            },
                            successMessage: 'Blog updated successfully',
                            errorMessage: 'Failed to update blog',
                        });
                    })}
                    className='space-y-6'
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <Collapsible
                                open={openSections.title}
                                onOpenChange={() => toggleSection('title')}
                            >
                                <FormField
                                    control={form.control}
                                    name='title'
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='flex items-center gap-2'>
                                                <CollapsibleTrigger asChild>
                                                    <Button
                                                        type='button'
                                                        variant='ghost'
                                                        size='icon'
                                                        className='h-5 w-5 -ml-1'
                                                    >
                                                        {openSections.title ? (
                                                            <ChevronUp className='h-4 w-4' />
                                                        ) : (
                                                            <ChevronDown className='h-4 w-4' />
                                                        )}
                                                    </Button>
                                                </CollapsibleTrigger>
                                                <FormLabel>Title *</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Input placeholder='Enter blog title' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <CollapsibleContent className='mt-2 space-y-3 pl-7'>
                                    <FormField
                                        control={form.control}
                                        name='titleAm'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-sm text-muted-foreground'>
                                                    Title (Amharic)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='Enter title in Amharic'
                                                        {...field}
                                                        value={field.value || ''}
                                                        className='text-sm'
                                                        onChange={(e) => field.onChange(e.target.value || undefined)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='titleOr'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-sm text-muted-foreground'>
                                                    Title (Oromo)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='Enter title in Oromo'
                                                        {...field}
                                                        value={field.value || ''}
                                                        className='text-sm'
                                                        onChange={(e) => field.onChange(e.target.value || undefined)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CollapsibleContent>
                            </Collapsible>



                            <Collapsible
                                open={openSections.excerpt}
                                onOpenChange={() => toggleSection('excerpt')}
                            >
                                <FormField
                                    control={form.control}
                                    name='excerpt'
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='flex items-center gap-2'>
                                                <CollapsibleTrigger asChild>
                                                    <Button
                                                        type='button'
                                                        variant='ghost'
                                                        size='icon'
                                                        className='h-5 w-5 -ml-1'
                                                    >
                                                        {openSections.excerpt ? (
                                                            <ChevronUp className='h-4 w-4' />
                                                        ) : (
                                                            <ChevronDown className='h-4 w-4' />
                                                        )}
                                                    </Button>
                                                </CollapsibleTrigger>
                                                <FormLabel>Excerpt</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Textarea
                                                    placeholder='Brief description of the blog'
                                                    rows={3}
                                                    {...field}
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <CollapsibleContent className='mt-2 space-y-3 pl-7'>
                                    <FormField
                                        control={form.control}
                                        name='excerptAm'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-sm text-muted-foreground'>
                                                    Excerpt (Amharic)
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder='Brief description in Amharic'
                                                        rows={3}
                                                        {...field}
                                                        value={field.value || ''}
                                                        className='text-sm'
                                                        onChange={(e) => field.onChange(e.target.value || undefined)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='excerptOr'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-sm text-muted-foreground'>
                                                    Excerpt (Oromo)
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder='Brief description in Oromo'
                                                        rows={3}
                                                        {...field}
                                                        value={field.value || ''}
                                                        className='text-sm'
                                                        onChange={(e) => field.onChange(e.target.value || undefined)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CollapsibleContent>
                            </Collapsible>

                            <Collapsible
                                open={openSections.content}
                                onOpenChange={() => toggleSection('content')}
                            >
                                <FormField
                                    control={form.control}
                                    name='content'
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='flex items-center gap-2'>
                                                <CollapsibleTrigger asChild>
                                                    <Button
                                                        type='button'
                                                        variant='ghost'
                                                        size='icon'
                                                        className='h-5 w-5 -ml-1'
                                                    >
                                                        {openSections.content ? (
                                                            <ChevronUp className='h-4 w-4' />
                                                        ) : (
                                                            <ChevronDown className='h-4 w-4' />
                                                        )}
                                                    </Button>
                                                </CollapsibleTrigger>
                                                <FormLabel>Content</FormLabel>
                                            </div>
                                            <FormControl>
                                                <RichTextEditor
                                                    content={
                                                        typeof field.value === 'string'
                                                            ? field.value
                                                            : field.value && typeof field.value === 'object' && 'html' in field.value
                                                                ? (field.value as any).html || ''
                                                                : ''
                                                    }
                                                    onChange={(htmlString) => {
                                                        // Store HTML string as JSON object with html property
                                                        field.onChange(htmlString ? { html: htmlString } : {});
                                                    }}
                                                    placeholder='Start writing your blog...'
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <CollapsibleContent className='mt-2 space-y-3 pl-7'>
                                    <FormField
                                        control={form.control}
                                        name='contentAm'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-sm text-muted-foreground'>
                                                    Content (Amharic)
                                                </FormLabel>
                                                <FormControl>
                                                    <RichTextEditor
                                                        content={
                                                            typeof field.value === 'string'
                                                                ? field.value
                                                                : field.value && typeof field.value === 'object' && 'html' in field.value
                                                                    ? (field.value as any).html || ''
                                                                    : ''
                                                        }
                                                        onChange={(htmlString) => {
                                                            // Store HTML string as JSON object with html property
                                                            field.onChange(htmlString ? { html: htmlString } : {});
                                                        }}
                                                        placeholder='Start writing your blog in Amharic...'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='contentOr'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='text-sm text-muted-foreground'>
                                                    Content (Oromo)
                                                </FormLabel>
                                                <FormControl>
                                                    <RichTextEditor
                                                        content={
                                                            typeof field.value === 'string'
                                                                ? field.value
                                                                : field.value && typeof field.value === 'object' && 'html' in field.value
                                                                    ? (field.value as any).html || ''
                                                                    : ''
                                                        }
                                                        onChange={(htmlString) => {
                                                            // Store HTML string as JSON object with html property
                                                            field.onChange(htmlString ? { html: htmlString } : {});
                                                        }}
                                                        placeholder='Start writing your blog in Oromo...'
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CollapsibleContent>
                            </Collapsible>

                            {categories.length > 0 && (
                                <FormField
                                    control={form.control}
                                    name='categoryId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value || ''}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select a category' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <FormField
                                control={form.control}
                                name='status'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(value as EBlogStatus)
                                            }
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={EBlogStatus.draft}>Draft</SelectItem>
                                                <SelectItem value={EBlogStatus.published}>
                                                    Published
                                                </SelectItem>
                                                <SelectItem value={EBlogStatus.archived}>
                                                    Archived
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='flex items-center gap-4'>
                                <FormField
                                    control={form.control}
                                    name='featured'
                                    render={({ field }) => (
                                        <FormItem className='flex items-center gap-2'>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel>Featured Blog</FormLabel>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='isFree'
                                    render={({ field }) => (
                                        <FormItem className='flex items-center gap-2'>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel>Free Blog</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name='price'
                                render={({ field }) => {
                                    const isFree = form.watch('isFree');
                                    return (
                                        <FormItem>
                                            <FormLabel>Price</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    placeholder='0.00'
                                                    {...field}
                                                    disabled={isFree}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ? parseFloat(e.target.value) : undefined,
                                                        )
                                                    }
                                                    value={field.value || ''}
                                                />
                                            </FormControl>
                                            {isFree && (
                                                <FormDescription className='text-xs text-muted-foreground'>
                                                    Price is disabled for free blogs
                                                </FormDescription>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Media</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <FormField
                                control={form.control}
                                name='featuredImage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Featured Image</FormLabel>
                                        <FormControl>
                                            <div className='space-y-2'>
                                                <Input
                                                    type='file'
                                                    accept='image/*'
                                                    onChange={handleImageUpload}
                                                    disabled={isUploading}
                                                />
                                                {featuredImage && (
                                                    <div className='relative w-32 h-32'>
                                                        <Image
                                                            src={featuredImage}
                                                            alt='Featured'
                                                            className='w-full h-full object-cover rounded'
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tags</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='flex gap-2'>
                                <Input
                                    placeholder='Add a tag'
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                />
                                <Button type='button' onClick={addTag}>
                                    <Plus className='h-4 w-4' />
                                </Button>
                            </div>
                            {tags.length > 0 && (
                                <div className='flex flex-wrap gap-2'>
                                    {tags.map((tag) => (
                                        <Badge key={tag} variant='secondary' className='gap-1'>
                                            {tag}
                                            <button
                                                type='button'
                                                onClick={() => removeTag(tag)}
                                                className='ml-1 hover:text-destructive'
                                            >
                                                <X className='h-3 w-3' />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>


                    <div className='flex items-center gap-4'>
                        <Button
                            type='button'
                            variant='ghost'
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className='h-4 w-4 mr-2' />
                            Cancel
                        </Button>
                        <Button type='submit' disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Blog'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

